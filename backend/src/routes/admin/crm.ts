import { Router } from 'express';
import { supabase } from '../../lib/supabase.js';
import { requireAdmin } from '../../middleware/auth.js';
import { adminRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();
router.use(requireAdmin);
router.use(adminRateLimiter);

/**
 * GET /api/admin/crm/upcoming-events
 * Fetches events in the next 30 days.
 */
router.get('/upcoming-events', async (_req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('customer_events')
      .select(`
        id,
        event_type,
        event_date,
        previous_order,
        notes,
        customers (
          id,
          name,
          phone,
          email
        )
      `);

    if (error) throw error;

    const upcomingEvents = (data || []).filter((event: any) => {
      const eventDate = new Date(event.event_date);
      const eventThisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      if (eventThisYear.getTime() < today.getTime() && eventThisYear.getDate() !== today.getDate()) {
        eventThisYear.setFullYear(today.getFullYear() + 1);
      }
      
      return eventThisYear.getTime() >= today.getTime() && eventThisYear.getTime() <= thirtyDaysFromNow.getTime();
    }).map((event: any) => {
        const customerName = event.customers?.name?.split(' ')[0] || 'there';
        let suggestedMessage = '';
        
        if (event.event_type === 'birthday') {
            suggestedMessage = `Hi ${customerName}, we noticed your birthday is coming up! Last year you loved our ${event.previous_order?.name || 'grazing board'}. Would you like us to prepare something special for you this year?`;
        } else if (event.event_type === 'anniversary') {
            suggestedMessage = `Hi ${customerName}, happy upcoming anniversary! Last year we prepared a ${event.previous_order?.name || 'bespoke hamper'} for you. Shall we do the same this year?`;
        } else {
            suggestedMessage = `Hi ${customerName}, checking in regarding your upcoming event. Let us know if you need any artisanal catering from Mezcla!`;
        }

        const eventDate = new Date(event.event_date);
        let eventThisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        if (eventThisYear.getTime() < today.getTime() && eventThisYear.getDate() !== today.getDate()) {
            eventThisYear.setFullYear(today.getFullYear() + 1);
        }
        
        return {
            ...event,
            suggested_message: suggestedMessage,
            days_until: Math.ceil((eventThisYear.getTime() - today.getTime()) / (1000 * 3600 * 24))
        };
    });

    upcomingEvents.sort((a, b) => a.days_until - b.days_until);

    res.json({ data: upcomingEvents });
  } catch (err) {
    next(err);
  }
});

export default router;
