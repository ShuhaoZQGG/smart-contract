import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { edgeFunctions } from '../services/edgeFunctions';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface GenerationResult {
  index: number;
  success: boolean;
  document?: any;
  downloadUrl?: string;
  error?: string;
}

const BulkGenerator: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, any>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'docx' | 'pdf'>('docx');

  React.useEffect(() => {
    loadTemplates();
  }, []);

  React.useEffect(() => {
    if (selectedTemplate) {
      loadTemplateVariables(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('templates')
      .select('id, name, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setTemplates(data);
    }
  };

  const loadTemplateVariables = async (templateId: string) => {
    try {
      const variables = await edgeFunctions.getTemplateVariables(templateId);
      const varNames = variables.map(v => v.name);
      setTemplateVariables(varNames);

      // Auto-map columns if names match
      const autoMapping: Record<string, string> = {};
      varNames.forEach(varName => {
        const matchingHeader = csvHeaders.find(h => 
          h.toLowerCase() === varName.toLowerCase() ||
          h.toLowerCase().replace(/\s+/g, '_') === varName.toLowerCase()
        );
        if (matchingHeader) {
          autoMapping[varName] = matchingHeader;
        }
      });
      setColumnMapping(autoMapping);
    } catch (error) {
      console.error('Failed to load template variables:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    
    try {
      const text = await file.text();
      const parsedData = edgeFunctions.parseCsvContent(text);
      
      if (parsedData.length > 0) {
        setCsvData(parsedData);
        setCsvHeaders(Object.keys(parsedData[0]));
        setShowResults(false);
        setResults([]);
      }
    } catch (error: any) {
      alert(`Failed to parse CSV: ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !user || csvData.length === 0) return;

    setIsGenerating(true);
    setShowResults(true);

    try {
      // Map CSV columns to template variables
      const mappedData = csvData.map(row => {
        const mappedRow: Record<string, any> = {};
        Object.entries(columnMapping).forEach(([varName, csvColumn]) => {
          mappedRow[varName] = row[csvColumn] || '';
        });
        return mappedRow;
      });

      // Generate documents
      const result = await edgeFunctions.bulkGenerate({
        templateId: selectedTemplate,
        csvData: mappedData,
        userId: user.id,
        outputFormat,
      });

      setResults(result.results || []);
    } catch (error: any) {
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAll = () => {
    results.forEach((result, index) => {
      if (result.success && result.downloadUrl) {
        setTimeout(() => {
          window.open(result.downloadUrl, '_blank');
        }, index * 500); // Stagger downloads to avoid browser blocking
      }
    });
  };

  const getSuccessRate = () => {
    if (results.length === 0) return 0;
    const successful = results.filter(r => r.success).length;
    return Math.round((successful / results.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Bulk Document Generation</h1>

          {/* Step 1: Select Template */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
              Select Template
            </h2>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Upload CSV */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
              Upload CSV File
            </h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                {csvFile ? csvFile.name : 'Click to upload CSV file or drag and drop'}
              </p>
              {csvData.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Loaded {csvData.length} rows with {csvHeaders.length} columns
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Step 3: Map Columns */}
          {selectedTemplate && csvHeaders.length > 0 && templateVariables.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                Map CSV Columns to Template Variables
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {templateVariables.map(variable => (
                    <div key={variable} className="flex items-center">
                      <label className="w-1/2 text-sm font-medium text-gray-700">
                        {variable.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
                      </label>
                      <select
                        value={columnMapping[variable] || ''}
                        onChange={(e) => setColumnMapping({
                          ...columnMapping,
                          [variable]: e.target.value
                        })}
                        className="w-1/2 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Column --</option>
                        {csvHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Configure Output */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
              Configure Output
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="docx"
                  checked={outputFormat === 'docx'}
                  onChange={(e) => setOutputFormat(e.target.value as 'docx')}
                  className="mr-2"
                />
                <FileText className="w-5 h-5 mr-1 text-blue-600" />
                DOCX
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={outputFormat === 'pdf'}
                  onChange={(e) => setOutputFormat(e.target.value as 'pdf')}
                  className="mr-2"
                />
                <FileText className="w-5 h-5 mr-1 text-red-600" />
                PDF
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={!selectedTemplate || csvData.length === 0 || isGenerating}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate Documents</span>
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {showResults && results.length > 0 && (
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Generation Results</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium">Success Rate:</span>{' '}
                    <span className={getSuccessRate() === 100 ? 'text-green-600' : 'text-yellow-600'}>
                      {getSuccessRate()}%
                    </span>
                  </div>
                  <button
                    onClick={downloadAll}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-3 mb-2 rounded ${
                      result.success ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className="text-sm">
                        Row {result.index + 1}: {result.success ? 'Generated successfully' : result.error || 'Failed'}
                      </span>
                    </div>
                    {result.success && result.downloadUrl && (
                      <a
                        href={result.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkGenerator;