import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, Plus, Edit2, Trash2, Play, X, Check, AlertCircle } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  display_name: string;
  data_type: string;
  default_value?: string;
}

interface AdvancedVariable {
  id: string;
  template_id: string;
  variable_id?: string;
  type: 'conditional' | 'computed' | 'lookup';
  condition_logic?: any;
  computation_formula?: string;
  lookup_source?: any;
}

interface AdvancedVariablesProps {
  templateId: string;
  variables: Variable[];
}

const AdvancedVariables: React.FC<AdvancedVariablesProps> = ({ templateId, variables }) => {
  const [advancedVariables, setAdvancedVariables] = useState<AdvancedVariable[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVariable, setEditingVariable] = useState<AdvancedVariable | null>(null);
  const [variableType, setVariableType] = useState<'conditional' | 'computed' | 'lookup' | ''>('');
  const [conditionLogic, setConditionLogic] = useState({
    if: '',
    equals: '',
    then: '',
    else: '',
    nested: [] as any[]
  });
  const [computationFormula, setComputationFormula] = useState('');
  const [formulaType, setFormulaType] = useState<'math' | 'date' | 'text'>('math');
  const [lookupSource, setLookupSource] = useState({
    type: 'database',
    table: '',
    key: '',
    returnField: '',
    apiEndpoint: '',
    authentication: '',
    csvData: null as any
  });
  const [showTestModal, setShowTestModal] = useState(false);
  const [testData, setTestData] = useState<Record<string, any>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvancedVariables();
  }, [templateId]);

  const fetchAdvancedVariables = async () => {
    try {
      const { data, error } = await supabase
        .from('advanced_variables')
        .select('*')
        .eq('template_id', templateId);
      
      if (error) throw error;
      setAdvancedVariables(data || []);
    } catch (error) {
      console.error('Error fetching advanced variables:', error);
    }
  };

  const handleSaveVariable = async () => {
    setErrors([]);
    
    // Validation
    if (!variableType) {
      setErrors(['Please select a variable type']);
      return;
    }
    
    if (variableType === 'conditional' && (!conditionLogic.if || !conditionLogic.then)) {
      setErrors(['Please configure the condition logic']);
      return;
    }
    
    if (variableType === 'computed' && !computationFormula) {
      setErrors(['Please enter a formula']);
      return;
    }
    
    if (variableType === 'lookup') {
      if (lookupSource.type === 'database' && (!lookupSource.table || !lookupSource.key || !lookupSource.returnField)) {
        setErrors(['Please configure the database lookup']);
        return;
      }
      if (lookupSource.type === 'api' && !lookupSource.apiEndpoint) {
        setErrors(['Please enter the API endpoint']);
        return;
      }
      if (lookupSource.type === 'csv' && !lookupSource.csvData) {
        setErrors(['Please upload a CSV file']);
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const variableData: Partial<AdvancedVariable> = {
        template_id: templateId,
        type: variableType,
      };
      
      if (variableType === 'conditional') {
        variableData.condition_logic = conditionLogic;
      } else if (variableType === 'computed') {
        variableData.computation_formula = computationFormula;
      } else if (variableType === 'lookup') {
        variableData.lookup_source = lookupSource;
      }
      
      if (editingVariable) {
        const { error } = await supabase
          .from('advanced_variables')
          .update(variableData)
          .eq('id', editingVariable.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('advanced_variables')
          .insert(variableData);
        
        if (error) throw error;
      }
      
      await fetchAdvancedVariables();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving variable:', error);
      setErrors(['Failed to save variable']);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariable = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this variable?')) return;
    
    try {
      const { error } = await supabase
        .from('advanced_variables')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchAdvancedVariables();
    } catch (error) {
      console.error('Error deleting variable:', error);
    }
  };

  const handleEditVariable = (variable: AdvancedVariable) => {
    setEditingVariable(variable);
    setVariableType(variable.type);
    
    if (variable.type === 'conditional') {
      setConditionLogic(variable.condition_logic || {
        if: '',
        equals: '',
        then: '',
        else: '',
        nested: []
      });
    } else if (variable.type === 'computed') {
      setComputationFormula(variable.computation_formula || '');
    } else if (variable.type === 'lookup') {
      setLookupSource(variable.lookup_source || {
        type: 'database',
        table: '',
        key: '',
        returnField: '',
        apiEndpoint: '',
        authentication: '',
        csvData: null
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVariable(null);
    setVariableType('');
    setConditionLogic({ if: '', equals: '', then: '', else: '', nested: [] });
    setComputationFormula('');
    setLookupSource({
      type: 'database',
      table: '',
      key: '',
      returnField: '',
      apiEndpoint: '',
      authentication: '',
      csvData: null
    });
    setErrors([]);
  };

  const validateFormula = () => {
    // Simple validation - check for matching brackets
    const openBrackets = (computationFormula.match(/\{\{/g) || []).length;
    const closeBrackets = (computationFormula.match(/\}\}/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      setErrors(['Invalid formula syntax: Unmatched brackets']);
      return false;
    }
    
    // Check for valid variable references
    const variablePattern = /\{\{(\w+)\}\}/g;
    const matches = computationFormula.matchAll(variablePattern);
    const invalidVars: string[] = [];
    
    for (const match of matches) {
      const varName = match[1];
      if (!variables.find(v => v.name === varName)) {
        invalidVars.push(varName);
      }
    }
    
    if (invalidVars.length > 0) {
      setErrors([`Invalid formula syntax: Unknown variables: ${invalidVars.join(', ')}`]);
      return false;
    }
    
    setErrors([]);
    return true;
  };

  const handleAddNestedCondition = () => {
    setConditionLogic({
      ...conditionLogic,
      nested: [...conditionLogic.nested, { if: '', equals: '', then: '', else: '' }]
    });
  };

  const handleRunTest = () => {
    const results: Record<string, any> = {};
    
    // Process conditional variables
    advancedVariables.filter(v => v.type === 'conditional').forEach(variable => {
      const logic = variable.condition_logic;
      if (logic) {
        const conditionValue = testData[logic.if];
        if (String(conditionValue) === String(logic.equals)) {
          results[`conditional_${variable.id}`] = logic.then;
        } else {
          results[`conditional_${variable.id}`] = logic.else;
        }
      }
    });
    
    // Process computed variables (simplified)
    advancedVariables.filter(v => v.type === 'computed').forEach(variable => {
      if (variable.computation_formula) {
        let formula = variable.computation_formula;
        Object.entries(testData).forEach(([key, value]) => {
          formula = formula.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
        });
        
        try {
          // Simple evaluation for demonstration
          results[`computed_${variable.id}`] = formula;
        } catch (error) {
          results[`computed_${variable.id}`] = 'Error evaluating formula';
        }
      }
    });
    
    setTestResults(results);
  };

  const getVariableTypeIcon = (type: string) => {
    switch (type) {
      case 'conditional':
        return '🔀';
      case 'computed':
        return '🧮';
      case 'lookup':
        return '🔍';
      default:
        return '📝';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Advanced Variables</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTestModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Test Variables
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Advanced Variable
          </button>
        </div>
      </div>

      {/* Variables List */}
      <div className="space-y-4">
        {advancedVariables.map((variable) => (
          <div key={variable.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getVariableTypeIcon(variable.type)}</span>
                <div>
                  <h3 className="font-semibold capitalize">
                    {variable.type === 'conditional' && 'Conditional Variable'}
                    {variable.type === 'computed' && 'Computed Variable'}
                    {variable.type === 'lookup' && 'Lookup Variable'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {variable.type === 'conditional' && variable.condition_logic && 
                      `If ${variable.condition_logic.if} = ${variable.condition_logic.equals}`}
                    {variable.type === 'computed' && variable.computation_formula && 
                      `Formula: ${variable.computation_formula.substring(0, 50)}...`}
                    {variable.type === 'lookup' && variable.lookup_source && 
                      `Source: ${variable.lookup_source.type}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditVariable(variable)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  aria-label="Edit variable"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVariable(variable.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  aria-label="Delete variable"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Configure Advanced Variable</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {errors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* Variable Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Variable Type</label>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="variableType"
                    value="conditional"
                    checked={variableType === 'conditional'}
                    onChange={(e) => setVariableType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Conditional</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="variableType"
                    value="computed"
                    checked={variableType === 'computed'}
                    onChange={(e) => setVariableType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Computed</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="variableType"
                    value="lookup"
                    checked={variableType === 'lookup'}
                    onChange={(e) => setVariableType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Lookup</span>
                </label>
              </div>
            </div>

            {/* Conditional Configuration */}
            {variableType === 'conditional' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Configure Condition Logic</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="if-variable" className="block text-sm font-medium mb-1">If Variable</label>
                    <select
                      id="if-variable"
                      value={conditionLogic.if}
                      onChange={(e) => setConditionLogic({...conditionLogic, if: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select variable</option>
                      {variables.map(v => (
                        <option key={v.id} value={v.name}>{v.display_name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="equals-value" className="block text-sm font-medium mb-1">Equals</label>
                    <input
                      id="equals-value"
                      type="text"
                      value={conditionLogic.equals}
                      onChange={(e) => setConditionLogic({...conditionLogic, equals: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Value to compare"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="then-value" className="block text-sm font-medium mb-1">Then Value</label>
                    <input
                      id="then-value"
                      type="text"
                      value={conditionLogic.then}
                      onChange={(e) => setConditionLogic({...conditionLogic, then: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Value if true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="else-value" className="block text-sm font-medium mb-1">Else Value</label>
                    <input
                      id="else-value"
                      type="text"
                      value={conditionLogic.else}
                      onChange={(e) => setConditionLogic({...conditionLogic, else: e.target.value})}
                      className="w-full p-2 border rounded"
                      placeholder="Value if false"
                    />
                  </div>
                </div>
                
                {conditionLogic.nested.map((nested, index) => (
                  <div key={index} className="p-4 border rounded bg-gray-50">
                    <h5 className="font-medium mb-2">Nested Condition {index + 1}</h5>
                    {/* Similar fields for nested conditions */}
                  </div>
                ))}
                
                <button
                  onClick={handleAddNestedCondition}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Add Nested Condition
                </button>
              </div>
            )}

            {/* Computed Configuration */}
            {variableType === 'computed' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Configure Formula</h4>
                
                <div>
                  <label htmlFor="formula-type" className="block text-sm font-medium mb-1">Formula Type</label>
                  <select
                    id="formula-type"
                    value={formulaType}
                    onChange={(e) => setFormulaType(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="math">Mathematical</option>
                    <option value="date">Date</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="formula" className="block text-sm font-medium mb-1">Formula</label>
                  <textarea
                    id="formula"
                    value={computationFormula}
                    onChange={(e) => setComputationFormula(e.target.value)}
                    className="w-full p-2 border rounded h-24"
                    placeholder="e.g., {{price}} * {{quantity}} * (1 - {{discount_rate}}/100)"
                  />
                </div>
                
                {formulaType === 'date' && (
                  <div className="p-4 bg-blue-50 rounded">
                    <h5 className="font-medium mb-2">Date Functions</h5>
                    <div className="space-y-1 text-sm">
                      <p><code>ADD_DAYS(date, days)</code> - Add days to a date</p>
                      <p><code>DATE_DIFF(date1, date2)</code> - Calculate difference between dates</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={validateFormula}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Validate Formula
                </button>
              </div>
            )}

            {/* Lookup Configuration */}
            {variableType === 'lookup' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Configure Data Source</h4>
                
                <div>
                  <label htmlFor="data-source" className="block text-sm font-medium mb-1">Data Source</label>
                  <select
                    id="data-source"
                    value={lookupSource.type}
                    onChange={(e) => setLookupSource({...lookupSource, type: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="database">Database</option>
                    <option value="api">API</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                
                {lookupSource.type === 'database' && (
                  <>
                    <div>
                      <label htmlFor="table-name" className="block text-sm font-medium mb-1">Table Name</label>
                      <input
                        id="table-name"
                        type="text"
                        value={lookupSource.table}
                        onChange={(e) => setLookupSource({...lookupSource, table: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., customers"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lookup-key" className="block text-sm font-medium mb-1">Lookup Key</label>
                        <input
                          id="lookup-key"
                          type="text"
                          value={lookupSource.key}
                          onChange={(e) => setLookupSource({...lookupSource, key: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="e.g., customer_id"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="return-field" className="block text-sm font-medium mb-1">Return Field</label>
                        <input
                          id="return-field"
                          type="text"
                          value={lookupSource.returnField}
                          onChange={(e) => setLookupSource({...lookupSource, returnField: e.target.value})}
                          className="w-full p-2 border rounded"
                          placeholder="e.g., discount_tier"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {lookupSource.type === 'api' && (
                  <>
                    <div>
                      <label htmlFor="api-endpoint" className="block text-sm font-medium mb-1">API Endpoint</label>
                      <input
                        id="api-endpoint"
                        type="text"
                        value={lookupSource.apiEndpoint}
                        onChange={(e) => setLookupSource({...lookupSource, apiEndpoint: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="https://api.example.com/lookup"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="authentication" className="block text-sm font-medium mb-1">Authentication</label>
                      <select
                        id="authentication"
                        value={lookupSource.authentication}
                        onChange={(e) => setLookupSource({...lookupSource, authentication: e.target.value})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">None</option>
                        <option value="api_key">API Key</option>
                        <option value="bearer">Bearer Token</option>
                      </select>
                    </div>
                  </>
                )}
                
                {lookupSource.type === 'csv' && (
                  <div className="p-4 border-2 border-dashed rounded text-center">
                    <p className="mb-2">Upload CSV File</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLookupSource({...lookupSource, csvData: file});
                        }
                      }}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVariable}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Variable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Test Variable Values</h3>
              <button onClick={() => setShowTestModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {variables.map(variable => (
                <div key={variable.id}>
                  <label htmlFor={variable.name} className="block text-sm font-medium mb-1">
                    {variable.display_name || variable.name}
                  </label>
                  <input
                    id={variable.name}
                    type="text"
                    value={testData[variable.name] || ''}
                    onChange={(e) => setTestData({...testData, [variable.name]: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleRunTest}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Run Test
            </button>

            {Object.keys(testResults).length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Test Results</h4>
                <div className="space-y-2">
                  {Object.entries(testResults).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTestData({});
                  setTestResults({});
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <p className="mb-4">Are you sure you want to delete this variable?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded">Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedVariables;