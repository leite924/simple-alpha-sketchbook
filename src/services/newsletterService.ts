
import { supabase } from "@/integrations/supabase/client";

// Function to subscribe a user to the newsletter
export const subscribeToNewsletter = async (email: string, source: string = 'website') => {
  try {
    // Check if email already exists but is unsubscribed
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      if (existingSubscription.active) {
        return {
          success: true,
          message: 'Este email já está inscrito na newsletter.',
          alreadySubscribed: true
        };
      } else {
        // Reactivate the subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            active: true,
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);

        if (updateError) {
          throw updateError;
        }

        return {
          success: true,
          message: 'Inscrição na newsletter reativada com sucesso!',
          reactivated: true
        };
      }
    }

    // Create a new subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        source,
        active: true
      });

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      message: 'Inscrição na newsletter realizada com sucesso!',
      newSubscription: true
    };
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: error.message || 'Ocorreu um erro ao processar sua inscrição.',
      error
    };
  }
};

// Function to unsubscribe a user from the newsletter
export const unsubscribeFromNewsletter = async (email: string) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Inscrição na newsletter cancelada com sucesso!'
    };
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      message: error.message || 'Ocorreu um erro ao cancelar sua inscrição.',
      error
    };
  }
};

// Function to check if an email is subscribed to the newsletter
export const checkSubscription = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('active')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      success: true,
      isSubscribed: data?.active === true,
      subscription: data
    };
  } catch (error: any) {
    console.error('Error checking newsletter subscription:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
