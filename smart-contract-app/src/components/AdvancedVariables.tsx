import React, { useState, useEffect } from 'react';
import { Calculator, GitBranch, Database, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdvancedVariable {
  id: string;
  template_id: string;
  variable_id?: string;
  type: 'conditional' | 'computed' | 'lookup';
  condition_logic?: any;
  computation_formula?: string;
  lookup_source?: any;
  created_at: string;
  updated_at: string;
  variable?: {
    name: string;
    display_name?: string;
  };
}

interface AdvancedVariablesProps {
  templateId: string;
  variables: Array<{ id: string; name: string; display_name?: string }>;
  onVariableUpdate?: (variable: AdvancedVariable) => void;
}

export const AdvancedVariables: React.FC<AdvancedVariablesProps> = ({
  templateId,
  variables,
  onVariableUpdate
}) => {
  const [advancedVariables, setAdvancedVariables] = useState<AdvancedVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVariable, setEditingVariable] = useState<AdvancedVariable | null>(null);
  const [formData, setFormData] = useState({
    variable_id: '',
    type: 'conditional' as const,
    condition_logic: {
      conditions: [{ field: '', operator: '==', value: '', result: '' }]
    },
    computation_formula: '',
    lookup_source: {
      table: '',
      key_field: '',
      value_field: ''
    }
  });

  const OPERATORS = [
    { value: '==', label: 'Equals' },
    { value: '!=', label: 'Not Equals' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater or Equal' },
    { value: '<=', label: 'Less or Equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' }
  ];

  useEffect(() => {
    fetchAdvancedVariables();
  }, [templateId]);

  const fetchAdvancedVariables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('advanced_variables')
        .select(`
          *,
          variable:variable_id(name, display_name)
        `)
        .eq('template_id', templateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvancedVariables(data || []);
    } catch (error) {
      console.error('Error fetching advanced variables:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAdvancedVariable = async () => {
    if (!formData.variable_id) return;

    try {
      const data: any = {
        template_id: templateId,
        variable_id: formData.variable_id,
        type: formData.type
      };

      switch (formData.type) {
        case 'conditional':
          data.condition_logic = formData.condition_logic;
          break;
        case 'computed':
          data.computation_formula = formData.computation_formula;
          break;
        case 'lookup':
          data.lookup_source = formData.lookup_source;
          break;
      }

      if (editingVariable) {
        const { error } = await supabase
          .from('advanced_variables')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingVariable.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('advanced_variables')
          .insert(data);

        if (error) throw error;
      }

      resetForm();
      fetchAdvancedVariables();
    } catch (error) {
      console.error('Error saving advanced variable:', error);
    }
  };

  const deleteAdvancedVariable = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this advanced variable?')) return;

    try {
      const { error } = await supabase
        .from('advanced_variables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAdvancedVariables();
    } catch (error) {
      console.error('Error deleting advanced variable:', error);
    }
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      condition_logic: {
        ...formData.condition_logic,
        conditions: [
          ...formData.condition_logic.conditions,
          { field: '', operator: '==', value: '', result: '' }
        ]
      }
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      condition_logic: {
        ...formData.condition_logic,
        conditions: formData.condition_logic.conditions.filter((_, i) => i !== index)
      }
    });
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...formData.condition_logic.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({
      ...formData,
      condition_logic: {
        ...formData.condition_logic,
        conditions: newConditions
      }
    });
  };

  const resetForm = () => {
    setFormData({
      variable_id: '',
      type: 'conditional',
      condition_logic: {
        conditions: [{ field: '', operator: '==', value: '', result: '' }]
      },
      computation_formula: '',
      lookup_source: {
        table: '',
        key_field: '',
        value_field: ''
      }
    });
    setEditingVariable(null);
    setShowForm(false);
  };

  const getVariableIcon = (type: string) => {
    switch (type) {
      case 'conditional':
        return <GitBranch className="w-4 h-4" />;
      case 'computed':
        return <Calculator className="w-4 h-4" />;
      case 'lookup':
        return <Database className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Variables</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
        >
          <Plus className="h-3 w-3" />
          <span>Add Advanced Variable</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-background rounded-lg border border-border p-4">
          <h4 className="font-medium mb-4">
            {editingVariable ? 'Edit Advanced Variable' : 'Create Advanced Variable'}
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Variable</label>
                <select
                  value={formData.variable_id}
                  onChange={(e) => setFormData({ ...formData, variable_id: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="">Select Variable</option>
                  {variables.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.display_name || v.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="conditional">Conditional</option>
                  <option value="computed">Computed</option>
                  <option value="lookup">Lookup</option>
                </select>
              </div>
            </div>

            {formData.type === 'conditional' && (
              <div>
                <label className="block text-sm font-medium mb-2">Conditions</label>
                <div className="space-y-2">
                  {formData.condition_logic.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={condition.field}
                        onChange={(e) => updateCondition(index, 'field', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-border rounded-md bg-background"
                      >
                        <option value="">Select Field</option>
                        {variables.map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.display_name || v.name}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                        className="w-32 px-2 py-1 text-sm border border-border rounded-md bg-background"
                      >
                        {OPERATORS.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-2 py-1 text-sm border border-border rounded-md bg-background"
                      />
                      
                      <span className="text-sm">→</span>
                      
                      <input
                        type="text"
                        value={condition.result}
                        onChange={(e) => updateCondition(index, 'result', e.target.value)}
                        placeholder="Result"
                        className="flex-1 px-2 py-1 text-sm border border-border rounded-md bg-background"
                      />
                      
                      {formData.condition_logic.conditions.length > 1 && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={addCondition}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    + Add Condition
                  </button>
                </div>
              </div>
            )}

            {formData.type === 'computed' && (
              <div>
                <label className="block text-sm font-medium mb-2">Formula</label>
                <textarea
                  value={formData.computation_formula}
                  onChange={(e) => setFormData({ ...formData, computation_formula: e.target.value })}
                  placeholder="e.g., {{price}} * {{quantity}} * 1.1"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use variable names in double curly braces. Supports basic math operations.
                </p>
              </div>
            )}

            {formData.type === 'lookup' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data Source</label>
                  <input
                    type="text"
                    value={formData.lookup_source.table}
                    onChange={(e) => setFormData({
                      ...formData,
                      lookup_source: { ...formData.lookup_source, table: e.target.value }
                    })}
                    placeholder="Table or API endpoint"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Field</label>
                    <input
                      type="text"
                      value={formData.lookup_source.key_field}
                      onChange={(e) => setFormData({
                        ...formData,
                        lookup_source: { ...formData.lookup_source, key_field: e.target.value }
                      })}
                      placeholder="Field to match"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Value Field</label>
                    <input
                      type="text"
                      value={formData.lookup_source.value_field}
                      onChange={(e) => setFormData({
                        ...formData,
                        lookup_source: { ...formData.lookup_source, value_field: e.target.value }
                      })}
                      placeholder="Field to return"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={saveAdvancedVariable}
                disabled={!formData.variable_id}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {editingVariable ? 'Update' : 'Create'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {advancedVariables.length === 0 ? (
        <div className="text-center py-8 bg-background rounded-lg border border-border">
          <Calculator className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-muted-foreground">
            No advanced variables configured. Add one to enable dynamic logic.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {advancedVariables.map((variable) => (
            <div
              key={variable.id}
              className="bg-background rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getVariableIcon(variable.type)}
                    <span className="font-medium">
                      {variable.variable?.display_name || variable.variable?.name}
                    </span>
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded capitalize">
                      {variable.type}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    {variable.type === 'conditional' && (
                      <div>
                        {variable.condition_logic?.conditions?.length || 0} condition(s)
                      </div>
                    )}
                    {variable.type === 'computed' && (
                      <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                        {variable.computation_formula}
                      </code>
                    )}
                    {variable.type === 'lookup' && (
                      <div>
                        Lookup from: {variable.lookup_source?.table}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingVariable(variable);
                      setFormData({
                        variable_id: variable.variable_id || '',
                        type: variable.type,
                        condition_logic: variable.condition_logic || {
                          conditions: [{ field: '', operator: '==', value: '', result: '' }]
                        },
                        computation_formula: variable.computation_formula || '',
                        lookup_source: variable.lookup_source || {
                          table: '',
                          key_field: '',
                          value_field: ''
                        }
                      });
                      setShowForm(true);
                    }}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAdvancedVariable(variable.id)}
                    className="text-sm text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};