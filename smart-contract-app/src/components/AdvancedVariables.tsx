import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, X, Calculator, Code, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Variable {
  id?: string;
  name: string;
  display_name: string;
  data_type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown';
  default_value?: string;
  is_required: boolean;
  position: number;
}

interface AdvancedVariable {
  id?: string;
  variable_id?: string;
  type: 'conditional' | 'computed' | 'lookup';
  condition_logic?: any;
  computation_formula?: string;
  lookup_source?: any;
}

interface AdvancedVariablesProps {
  templateId: string;
  variables: Variable[];
  onVariableUpdate: (variables: Variable[]) => void;
  onAdvancedVariableUpdate?: (advancedVariables: AdvancedVariable[]) => void;
}

export const AdvancedVariables: React.FC<AdvancedVariablesProps> = ({
  templateId,
  variables,
  onVariableUpdate,
  onAdvancedVariableUpdate
}) => {
  const [advancedVariables, setAdvancedVariables] = useState<AdvancedVariable[]>([]);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [advancedType, setAdvancedType] = useState<'conditional' | 'computed' | 'lookup'>('computed');
  const [formula, setFormula] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadAdvancedVariables();
  }, [templateId]);

  const loadAdvancedVariables = async () => {
    try {
      const { data, error } = await supabase
        .from('advanced_variables')
        .select('*')
        .eq('template_id', templateId);

      if (error) throw error;
      if (data) {
        setAdvancedVariables(data);
      }
    } catch (error) {
      console.error('Error loading advanced variables:', error);
    }
  };

  const handleAddAdvancedVariable = async () => {
    if (!selectedVariable) return;

    const newAdvancedVar: AdvancedVariable = {
      variable_id: selectedVariable.id,
      type: advancedType,
      computation_formula: advancedType === 'computed' ? formula : undefined,
      condition_logic: advancedType === 'conditional' ? { condition: formula } : undefined,
      lookup_source: advancedType === 'lookup' ? { source: formula } : undefined,
    };

    try {
      const { data, error } = await supabase
        .from('advanced_variables')
        .insert({
          template_id: templateId,
          ...newAdvancedVar
        })
        .select()
        .single();

      if (error) throw error;

      const updated = [...advancedVariables, data];
      setAdvancedVariables(updated);
      
      if (onAdvancedVariableUpdate) {
        onAdvancedVariableUpdate(updated);
      }

      setSelectedVariable(null);
      setFormula('');
      setTestResult(null);
    } catch (error) {
      console.error('Error adding advanced variable:', error);
    }
  };

  const handleRemoveAdvancedVariable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advanced_variables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updated = advancedVariables.filter(v => v.id !== id);
      setAdvancedVariables(updated);
      
      if (onAdvancedVariableUpdate) {
        onAdvancedVariableUpdate(updated);
      }
    } catch (error) {
      console.error('Error removing advanced variable:', error);
    }
  };

  const testFormula = () => {
    if (!formula) return;

    try {
      // Create a safe evaluation context
      const context: Record<string, any> = {};
      variables.forEach(v => {
        context[v.name] = v.data_type === 'number' ? 100 : 'test_value';
      });

      // Simple formula evaluation (in production, use a proper expression parser)
      let result = formula;
      Object.entries(context).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, String(value));
      });

      // Try to evaluate mathematical expressions
      if (advancedType === 'computed' && /^[\d\s+\-*/().]+$/.test(result)) {
        try {
          // This is a simple evaluation - in production, use a safe math parser
          const evaluated = Function(`"use strict"; return (${result})`)();
          setTestResult(String(evaluated));
        } catch {
          setTestResult(result);
        }
      } else {
        setTestResult(result);
      }
    } catch (error) {
      setTestResult('Error: Invalid formula');
    }
  };

  const getVariableTypeIcon = (type: string) => {
    switch (type) {
      case 'conditional':
        return <Code className="w-4 h-4" />;
      case 'computed':
        return <Calculator className="w-4 h-4" />;
      case 'lookup':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Variables</h3>
        <button
          onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" />
          Advanced Variables
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedPanel ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Basic Variables List */}
      <div className="space-y-2">
        {variables.map((variable) => {
          const advVar = advancedVariables.find(av => av.variable_id === variable.id);
          return (
            <div
              key={variable.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-purple-600">
                  {`{{${variable.name}}}`}
                </span>
                <span className="text-sm text-gray-600">
                  {variable.display_name}
                </span>
                {advVar && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {getVariableTypeIcon(advVar.type)}
                    {advVar.type}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {variable.data_type}
                {variable.is_required && ' • Required'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Advanced Variables Panel */}
      {showAdvancedPanel && (
        <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-4 font-semibold">Configure Advanced Variable</h4>
          
          <div className="space-y-4">
            {/* Variable Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Variable
              </label>
              <select
                value={selectedVariable?.name || ''}
                onChange={(e) => {
                  const variable = variables.find(v => v.name === e.target.value);
                  setSelectedVariable(variable || null);
                }}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Choose a variable...</option>
                {variables.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.display_name} ({v.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Advanced Type
              </label>
              <div className="flex gap-2">
                {(['computed', 'conditional', 'lookup'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAdvancedType(type)}
                    className={`flex-1 py-2 px-3 rounded-lg capitalize ${
                      advancedType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Input */}
            {selectedVariable && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {advancedType === 'computed' ? 'Computation Formula' :
                   advancedType === 'conditional' ? 'Condition Logic' :
                   'Lookup Source'}
                </label>
                <textarea
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder={
                    advancedType === 'computed' ? '{{amount}} * {{discount_rate}} / 100' :
                    advancedType === 'conditional' ? 'IF {{has_discount}} THEN {{discount_amount}} ELSE 0' :
                    'api.example.com/lookup/{{customer_id}}'
                  }
                  className="w-full p-2 border rounded-lg font-mono text-sm"
                  rows={3}
                />
                
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={testFormula}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Test Formula
                  </button>
                  {testResult && (
                    <span className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded">
                      Result: {testResult}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Add Button */}
            {selectedVariable && formula && (
              <button
                onClick={handleAddAdvancedVariable}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Advanced Variable
              </button>
            )}
          </div>

          {/* Existing Advanced Variables */}
          {advancedVariables.length > 0 && (
            <div className="mt-6 space-y-2">
              <h5 className="font-medium">Configured Advanced Variables</h5>
              {advancedVariables.map((av) => {
                const variable = variables.find(v => v.id === av.variable_id);
                return (
                  <div key={av.id} className="flex items-center justify-between p-3 bg-white rounded">
                    <div>
                      <span className="font-mono text-sm">
                        {variable?.name || 'Unknown'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({av.type})
                      </span>
                      {av.computation_formula && (
                        <div className="text-xs text-gray-600 mt-1 font-mono">
                          {av.computation_formula}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => av.id && handleRemoveAdvancedVariable(av.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};