import { supabase } from '../supabase';
import { ContactMessage, ContactMethod } from '../types';

export const messageService = {
  async create(data: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage> {
    try {
      const { data: message, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name,
          contact_method: data.contact_method,
          message: data.message,
          read: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        throw new Error('Failed to send message');
      }

      return message;
    } catch (error) {
      console.error('Error in create message:', error);
      throw error;
    }
  },

  async getAll(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to load messages');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAll messages:', error);
      throw error;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking message as read:', error);
        throw new Error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error in delete message:', error);
      throw error;
    }
  }
};
