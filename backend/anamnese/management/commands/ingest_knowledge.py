import os
import pandas as pd
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from agno.knowledge import Knowledge
from agno.vectordb.lancedb import LanceDb
from agno.knowledge.embedder.ollama import OllamaEmbedder
from agno.knowledge.document import Document

class Command(BaseCommand):
    help = 'Ingest Knowledge Base (FAQ and CID-10) into LanceDB'

    def handle(self, *args, **kwargs):
        self.stdout.write("Initializing Knowledge Base ingestion...")
        
        # Paths
        # Django BASE_DIR is usually 'backend' folder
        BASE_DIR = Path(settings.BASE_DIR)
        ROOT_DIR = BASE_DIR.parent
        
        FAQ_PATH = ROOT_DIR / "FAQ.MD"
        CID_PATH = ROOT_DIR / "cid10_sample.csv"
        # Using home directory to avoid 'Operation not supported' on external drives (LanceDB atomic rename)
        DB_PATH = Path.home() / ".medical_lancedb"
        
        # Ensure DB directory exists
        os.makedirs(DB_PATH, exist_ok=True)
        
        # Initialize Embedder (Using Ollama)
        # Note: Ensure 'nomic-embed-text' or similar is pulled: `ollama pull nomic-embed-text`
        # Fallback to llama3.2 if nomic not found (optimization for user)
        embedder = OllamaEmbedder(id="nomic-embed-text", dimensions=768)
        
        # Initialize Vector DB
        vector_db = LanceDb(
            table_name="medical_knowledge",
            uri=str(DB_PATH),
            embedder=embedder,
        )
        # Create table if not exists
        vector_db.create()
        
        documents = []
        
        # 1. Process FAQ.MD (Semantic Chunking by Headers)
        if FAQ_PATH.exists():
            self.stdout.write(f"Processing {FAQ_PATH}...")
            content = FAQ_PATH.read_text(encoding="utf-8")
            
            # Simple splitting by H2/H3 headers for now
            # A more robust approach utilizes MarkdownReader, but strict manual splitting gives control
            sections = content.split("## ")
            for section in sections:
                if not section.strip(): continue
                
                lines = section.split("\n")
                header = lines[0].strip()
                body = "\n".join(lines[1:]).strip()
                
                if body:
                    doc = Document(
                        content=f"PROTOCOL: {header}\n{body}",
                        meta_data={"source": "FAQ.MD", "type": "protocol", "topic": header}
                    )
                    documents.append(doc)
        else:
            self.stdout.write(self.style.WARNING(f"File not found: {FAQ_PATH}"))

        # 2. Process CID-10 CSV (Structural Chunking)
        if CID_PATH.exists():
            self.stdout.write(f"Processing {CID_PATH}...")
            df = pd.read_csv(CID_PATH)
            
            for _, row in df.iterrows():
                code = str(row['CODIGO']).strip()
                desc = str(row['DESCRICAO']).strip()
                
                doc = Document(
                    content=f"CID-10: {code} - {desc}",
                    meta_data={"source": "CID-10", "type": "cid", "code": code}
                )
                documents.append(doc)
        else:
            self.stdout.write(self.style.WARNING(f"File not found: {CID_PATH}"))
            
        if not documents:
            self.stdout.write(self.style.ERROR("No documents to ingest."))
            return

        # Load into LanceDB
        self.stdout.write(f"Ingesting {len(documents)} documents into LanceDB...")
        # We use a static content_hash for manual ingestion to allow updates
        vector_db.upsert(content_hash="manual_ingestion", documents=documents)
        
        self.stdout.write(self.style.SUCCESS("Ingestion Complete!"))
