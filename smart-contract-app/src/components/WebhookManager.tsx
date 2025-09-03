import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WebhookConfig {
  id: string;
  user_id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const AVAILABLE_EVENTS = [
  { value: 'template.created', label: 'Template Created' },
  { value: 'template.updated', label: 'Template Updated' },
  { value: 'template.deleted', label: 'Template Deleted' },
  { value: 'document.generated', label: 'Document Generated' },
  { value: 'document.bulk_generated', label: 'Bulk Generation Complete' },
  { value: 'template.shared', label: 'Template Shared' },
  { value: 'template.commented', label: 'Comment Added' },
  { value: 'template.rated', label: 'Template Rated' }
];

export const WebhookManager: React.FC = () => {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
    active: true
  });
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWebhooks();
    }
  }, [user]);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWebhook = async () => {
    if (!user || !formData.name || !formData.url || formData.events.length === 0) return;

    try {
      const webhookData = {
        user_id: user.id,
        name: formData.name,
        url: formData.url,
        events: formData.events,
        secret: formData.secret || null,
        active: formData.active
      };

      if (editingWebhook) {
        const { error } = await supabase
          .from('webhooks')
          .update({
            ...webhookData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingWebhook.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('webhooks')
          .insert(webhookData);

        if (error) throw error;
      }

      resetForm();
      fetchWebhooks();
    } catch (error) {
      console.error('Error saving webhook:', error);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this webhook?')) return;

    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  };

  const toggleWebhookStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ 
          active: !active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      fetchWebhooks();
    } catch (error) {
      console.error('Error toggling webhook status:', error);
    }
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    setTestingWebhook(webhook.id);
    
    try {
      // Call edge function to test webhook
      const { data, error } = await supabase.functions.invoke('test-webhook', {
        body: {
          webhook_id: webhook.id,
          url: webhook.url,
          secret: webhook.secret,
          event: 'test.ping',
          payload: {
            message: 'This is a test webhook from Smart Contract',
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      alert('Test webhook sent successfully! Check your endpoint.');
    } catch (error) {
      console.error('Error testing webhook:', error);
      alert('Failed to send test webhook. Please check your URL.');
    } finally {
      setTestingWebhook(null);
    }
  };

  const editWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret || '',
      active: webhook.active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      events: [],
      secret: '',
      active: true
    });
    setEditingWebhook(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Webhook className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Webhooks</h2>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>Add Webhook</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingWebhook ? 'Edit Webhook' : 'Create New Webhook'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Webhook"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Endpoint URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://api.example.com/webhook"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Secret (Optional)</label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="Your webhook secret for signature verification"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll include this in the X-Webhook-Signature header
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Events</label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <label
                    key={event.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            events: [...formData.events, event.value]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            events: formData.events.filter(ev => ev !== event.value)
                          });
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-border"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={saveWebhook}
                disabled={!formData.name || !formData.url || formData.events.length === 0}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {editingWebhook ? 'Update' : 'Create'}
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

      {webhooks.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-lg border border-border">
          <Webhook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No webhooks configured</h3>
          <p className="text-muted-foreground mt-2">
            Create your first webhook to receive real-time events
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="bg-background rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{webhook.name}</h3>
                    {webhook.active ? (
                      <span className="flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {webhook.url}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="text-xs bg-primary/10 px-2 py-1 rounded"
                      >
                        {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => testWebhook(webhook)}
                    disabled={testingWebhook === webhook.id}
                    className="text-sm text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    {testingWebhook === webhook.id ? 'Testing...' : 'Test'}
                  </button>
                  <button
                    onClick={() => toggleWebhookStatus(webhook.id, webhook.active)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    {webhook.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => editWebhook(webhook)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook.id)}
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