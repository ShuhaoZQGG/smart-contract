# Smart Contract Document Template System

A powerful tool that lets users upload any document, manually insert variables like {{client_name}} where needed, then generate personalized versions by simply filling in the variable values.

## Core Features

### Document Management
- **Upload Any Document**: Support for DOCX, PDF, and TXT formats
- **Template Creation**: Convert any document into a reusable template
- **Variable System**: Insert {{variable_name}} placeholders manually
- **Visual Editor**: Rich text editing with live preview
- **Format Preservation**: Maintain all original formatting and styling

### Document Generation
- **Single Document**: Generate personalized documents via form input
- **Bulk Generation**: Process multiple documents from CSV data
- **Multiple Formats**: Export as PDF or DOCX
- **Preview Mode**: Review documents before generation
- **Base64 Encoding**: Support for binary format handling

### Template Library
- **Template Management**: Organize, search, and filter templates
- **Version Control**: Track template changes over time
- **Sharing System**: Share templates with team members
- **Usage Analytics**: Track template usage and generation stats

### Backend Infrastructure
- **Supabase Integration**: PostgreSQL database with Row Level Security
- **Edge Functions**: Serverless document processing
- **Authentication**: Secure user authentication via Supabase Auth
- **Storage**: Cloud storage for templates and generated documents
- **Real-time Updates**: WebSocket support for live collaboration (planned)

## Project Status: Cycle 1 Complete ✅ | PR #31 Merged

### Completed Features (Cycle 1 - PR #31)
- ✅ **Planning & Design**
  - Comprehensive architectural plan with Cycle 3 enhancements outlined
  - Full UI/UX specifications with Material Design 3
  - Mobile-responsive designs
  - Accessibility compliance (WCAG 2.1 AA)

- ✅ **Document Generation Core**
  - Variable substitution system with {{variable}} syntax
  - Single document generation with variable replacement
  - Bulk generation from CSV data
  - Base64 encoding for binary formats
  
- ✅ **Document Processing**
  - DOCX text extraction (mammoth)
  - PDF generation (pdf-lib)
  - Template processing (docxtemplater + pizzip)
  - Format conversion utilities
  
- ✅ **Backend Infrastructure**
  - Supabase database with 7 core tables + RLS policies
  - 4 Edge Functions deployed and active
  - Authentication system configured
  - Cloud storage bucket operational
  
- ✅ **Rich Text Editor**
  - Lexical integration for advanced formatting
  - Variable insertion with {{syntax}} highlighting
  - Formatting toolbar with rich text capabilities
  - Undo/redo functionality

- ✅ **Real-time Collaboration**
  - WebSocket implementation via Supabase Realtime
  - Presence indicators and active user tracking
  - CollaborationPresence component
  - useRealtimeCollaboration hook

- ✅ **Template Marketplace UI**
  - Public template gallery interface
  - Search and filter functionality
  - Categories and tags system
  - Template cloning capabilities

- ✅ **Performance & Quality**
  - 86/89 tests passing (96.6% pass rate)
  - Bundle optimized: 546KB → 107KB
  - TypeScript throughout
  - No critical security vulnerabilities

### Security Configuration Required (Dashboard Access Needed)
⚠️ **Manual configuration required in Supabase Dashboard**:
- Enable HaveIBeenPwned password protection
- Configure additional MFA options
- These settings cannot be configured via API/MCP

### Planned Features (Cycle 2)
- 📋 **Advanced Collaboration**
  - Conflict resolution for simultaneous edits
  - Commenting system on templates
  - Version control and rollback

- 📋 **Marketplace Backend**
  - Rating and review system
  - Template monetization
  - Analytics and usage tracking

- 📋 **Enterprise Features**
  - Advanced variable types (conditional, computed)
  - API integrations
  - Webhook support
  - Batch processing improvements

### Core Workflow

Upload → Any document becomes a template
Edit → Manually insert variables where needed
Generate → Input variable values → Get personalized document

Detailed Implementation Plan
Phase 1: Template Creation & Storage
python# Workflow:
1. User uploads document (DOCX/PDF)
2. System saves as template with unique ID
3. Extract and store editable content
4. Preserve all formatting
File Structure:
templates/
├── template_001/
│   ├── original.docx         # Original uploaded file
│   ├── template.json         # Extracted content + formatting
│   ├── variables.json        # List of variables used
│   └── metadata.json         # Name, created date, etc.
Phase 2: Template Editor Interface
Visual Editor Features:
┌─────────────────────────────────────────────┐
│  [Save] [Preview] [Add Variable] [Export]  │
├─────────────────────────────────────────────┤
│                                             │
│  Loan Agreement                             │
│                                             │
│  This agreement is between {{bank_name}}   │
│  and {{client_name}} (the "Borrower").     │
│                                             │
│  Date: {{agreement_date}}                  │
│  Loan Amount: {{loan_amount}}              │
│  Interest Rate: {{interest_rate}}%         │
│                                             │
│  The borrower {{client_name}} agrees to    │
│  repay the amount by {{due_date}}.         │
│                                             │
└─────────────────────────────────────────────┘

Variables Panel:
┌──────────────────┐
│ Variables Used:  │
│ • bank_name      │
│ • client_name    │
│ • agreement_date │
│ • loan_amount    │
│ • interest_rate  │
│ • due_date       │
└──────────────────┘
Editor Functionality:
javascript// Core editor features:
- Click anywhere in text to place cursor
- Type {{variable_name}} to insert variable
- Or use "Insert Variable" button
- Variables are highlighted in different color
- Right-click variable to edit/remove
- Auto-complete for existing variables
- Real-time variable list update
Phase 3: Document Generation
Single Document Generation:
┌────────────────────────────────────┐
│  Generate Document                 │
├────────────────────────────────────┤
│  Template: Loan Agreement v2       │
│                                    │
│  Fill in Variables:                │
│  bank_name:      [___________]     │
│  client_name:    [___________]     │
│  agreement_date: [___________]     │
│  loan_amount:    [___________]     │
│  interest_rate:  [___________]     │
│  due_date:       [___________]     │
│                                    │
│  [Generate PDF] [Generate DOCX]    │
└────────────────────────────────────┘
Bulk Generation from CSV:
csvbank_name,client_name,agreement_date,loan_amount,interest_rate,due_date
"First National","John Smith","2024-03-15","50000","5.5","2025-03-15"
"First National","Jane Doe","2024-03-16","75000","5.25","2025-03-16"
"First National","Bob Johnson","2024-03-17","100000","5.0","2025-03-17"
Technical Architecture
Backend API (Python/FastAPI)
pythonfrom fastapi import FastAPI, UploadFile, File
from typing import List, Dict
import json
from docx import Document
from pathlib import Path

app = FastAPI()

class TemplateManager:
    def __init__(self):
        self.templates_dir = Path("templates")
        
    async def save_template(self, file: UploadFile) -> str:
        """Save uploaded document as template"""
        template_id = generate_unique_id()
        template_path = self.templates_dir / template_id
        template_path.mkdir(parents=True)
        
        # Save original file
        original_path = template_path / f"original{Path(file.filename).suffix}"
        with open(original_path, "wb") as f:
            f.write(await file.read())
        
        # Extract content for editing
        content = self.extract_content(original_path)
        
        # Save as editable template
        with open(template_path / "template.json", "w") as f:
            json.dump(content, f)
            
        return template_id
    
    def extract_content(self, file_path: Path) -> Dict:
        """Extract text content while preserving structure"""
        if file_path.suffix == ".docx":
            doc = Document(file_path)
            content = {
                "type": "docx",
                "paragraphs": []
            }
            
            for para in doc.paragraphs:
                content["paragraphs"].append({
                    "text": para.text,
                    "style": para.style.name,
                    "alignment": str(para.alignment),
                    "formatting": {
                        "bold": para.runs[0].bold if para.runs else False,
                        "italic": para.runs[0].italic if para.runs else False,
                        "font_size": para.runs[0].font.size if para.runs else None
                    }
                })
            
            return content
    
    def insert_variables(self, template_id: str, content_with_variables: str):
        """Save template with variables inserted"""
        template_path = self.templates_dir / template_id
        
        # Parse and save the new content with variables
        with open(template_path / "template_with_variables.json", "w") as f:
            json.dump({"content": content_with_variables}, f)
        
        # Extract and save variable list
        variables = self.extract_variables(content_with_variables)
        with open(template_path / "variables.json", "w") as f:
            json.dump(variables, f)
    
    def extract_variables(self, content: str) -> List[str]:
        """Extract all {{variable}} patterns"""
        import re
        pattern = r'\{\{(\w+)\}\}'
        return list(set(re.findall(pattern, content)))
    
    def generate_document(self, template_id: str, variables: Dict[str, str]):
        """Replace variables with actual values"""
        template_path = self.templates_dir / template_id
        
        # Load template with variables
        with open(template_path / "template_with_variables.json", "r") as f:
            template = json.load(f)
        
        # Replace variables
        content = template["content"]
        for var_name, var_value in variables.items():
            content = content.replace(f"{{{{{var_name}}}}}", var_value)
        
        # Generate final document
        return self.create_document(content, template_path / "original.docx")

# API Endpoints
@app.post("/api/templates/upload")
async def upload_template(file: UploadFile = File(...)):
    """Upload a document to use as template"""
    template_id = await template_manager.save_template(file)
    return {"template_id": template_id, "status": "success"}

@app.get("/api/templates/{template_id}/edit")
async def get_template_for_editing(template_id: str):
    """Get template content for editing"""
    # Return the extracted content for the editor
    pass

@app.put("/api/templates/{template_id}/variables")
async def save_template_with_variables(template_id: str, content: str):
    """Save template after variables are inserted"""
    template_manager.insert_variables(template_id, content)
    return {"status": "success"}

@app.post("/api/templates/{template_id}/generate")
async def generate_document(template_id: str, variables: Dict[str, str]):
    """Generate document with variable values"""
    document = template_manager.generate_document(template_id, variables)
    return FileResponse(document)

@app.post("/api/templates/{template_id}/generate-bulk")
async def generate_bulk(template_id: str, csv_file: UploadFile):
    """Generate multiple documents from CSV"""
    import csv
    import io
    
    content = await csv_file.read()
    reader = csv.DictReader(io.StringIO(content.decode()))
    
    documents = []
    for row in reader:
        doc = template_manager.generate_document(template_id, row)
        documents.append(doc)
    
    # Return as zip file
    return create_zip(documents)
Frontend (React/Simple HTML+JS)
javascript// Simple Web Interface
class TemplateEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.variables = new Set();
        this.content = "";
    }
    
    loadTemplate(templateId) {
        // Fetch template content from backend
        fetch(`/api/templates/${templateId}/edit`)
            .then(res => res.json())
            .then(data => {
                this.content = data.content;
                this.render();
            });
    }
    
    insertVariable() {
        const varName = prompt("Enter variable name:");
        if (varName) {
            const variable = `{{${varName}}}`;
            this.insertAtCursor(variable);
            this.variables.add(varName);
            this.updateVariablesList();
        }
    }
    
    insertAtCursor(text) {
        const textarea = this.container.querySelector('#editor');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        textarea.value = before + text + after;
        this.highlightVariables();
    }
    
    highlightVariables() {
        // Highlight {{variables}} in different color
        const content = this.container.querySelector('#editor').value;
        const highlighted = content.replace(
            /\{\{(\w+)\}\}/g, 
            '<span class="variable">{{$1}}</span>'
        );
        this.container.querySelector('#preview').innerHTML = highlighted;
    }
    
    saveTemplate() {
        const content = this.container.querySelector('#editor').value;
        fetch(`/api/templates/${this.templateId}/variables`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: content})
        });
    }
}

// Document Generation UI
class DocumentGenerator {
    constructor(templateId) {
        this.templateId = templateId;
        this.loadVariables();
    }
    
    loadVariables() {
        fetch(`/api/templates/${this.templateId}/variables`)
            .then(res => res.json())
            .then(variables => {
                this.renderForm(variables);
            });
    }
    
    renderForm(variables) {
        const form = document.getElementById('generation-form');
        variables.forEach(variable => {
            form.innerHTML += `
                <div class="form-group">
                    <label>${variable}:</label>
                    <input type="text" name="${variable}" />
                </div>
            `;
        });
    }
    
    generate() {
        const formData = new FormData(document.getElementById('generation-form'));
        const variables = Object.fromEntries(formData);
        
        fetch(`/api/templates/${this.templateId}/generate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(variables)
        })
        .then(res => res.blob())
        .then(blob => {
            // Download generated document
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated_document.docx';
            a.click();
        });
    }
}
Key Features to Implement

Template Editor Page

Rich text editor with variable insertion
Syntax highlighting for variables
Variable autocomplete
Preview mode
Save/Load functionality


Variable Management

List all variables in template
Rename variables globally
Set variable types (text, date, number)
Default values
Validation rules


Generation Interface

Form-based input for single documents
CSV upload for bulk generation
Preview before generation
Multiple output formats (PDF, DOCX)
Download individually or as ZIP


Template Library

List all saved templates
Search and filter
Duplicate templates
Version history
Share templates



Database Schema (SQLite/PostgreSQL)
sqlCREATE TABLE templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    original_filename VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE template_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id VARCHAR(50) REFERENCES templates(id),
    version_number INTEGER,
    content TEXT,
    variables JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id VARCHAR(50) REFERENCES templates(id),
    variable_values JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(100),
    output_format VARCHAR(10)
);
File Structure
project/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── template_manager.py    # Core template logic
│   ├── document_generator.py  # Document generation
│   ├── models.py             # Database models
│   └── utils.py              # Helper functions
├── frontend/
│   ├── index.html            # Main page
│   ├── editor.html           # Template editor
│   ├── generate.html         # Generation form
│   ├── style.css            # Styling
│   └── app.js               # Frontend logic
├── templates/                # Stored templates
├── generated/               # Generated documents
├── requirements.txt         # Python dependencies
└── README.md               # Documentation