import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "@/components/ui-custom/PolicyShell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions | Mezcla" }, { name: "description", content: "Terms of service for orders, custom requests and events with Mezcla." }] }),
  component: () => (
    <PolicyShell
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="By placing an order with Mezcla, you agree to the terms outlined below."
      sections={[
        { h: "Delivery Policy", p: <div className="space-y-2">
            <p>Mezcla offers delivery within Bangalore and select surrounding areas.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delivery charges are calculated based on the order value, delivery location, and logistical requirements.</li>
              <li>Delivery timings are agreed upon at the time of order confirmation.</li>
              <li>While we make every effort to deliver on schedule, delays caused by traffic, weather conditions, road closures, or unforeseen circumstances may occur.</li>
              <li>Customers are requested to provide accurate delivery details and ensure that someone is available to receive the order.</li>
              <li>Once an order has been delivered and accepted, responsibility for storage and handling passes to the customer.</li>
            </ul>
          </div> },
        { h: "Cancellation Policy", p: <div className="space-y-2">
            <p>As all Mezcla products are made to order, cancellations are subject to the following terms:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders cancelled more than 2 days before the delivery date may be eligible for a partial refund after deducting any non-recoverable costs already incurred.</li>
              <li>Custom orders, event catering bookings, grazing tables, dessert tables, and personalised hampers cannot be cancelled once production, procurement, or event planning has commenced.</li>
              <li>In the event of a cancellation, any refund will be determined at Mezcla's sole discretion, taking into account the work already completed, ingredients or materials procured, and any business opportunities or bookings declined as a result of accepting the order.</li>
              <li>Any cancellation requests must be made in writing via email or WhatsApp.</li>
            </ul>
          </div> },
        { h: "Refund Policy", p: <div className="space-y-2">
            <p>Due to the perishable nature of our products, refunds are generally not offered once an order has been delivered.</p>
            <p>Refunds or replacements may be considered in the following situations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Incorrect items delivered.</li>
              <li>Products significantly damaged during delivery.</li>
              <li>Quality concerns reported within 2 hours of delivery, along with supporting photographs.</li>
            </ul>
            <p>Refund requests will be reviewed on a case-by-case basis. Mezcla reserves the right to offer a replacement, store credit, or partial/full refund where appropriate.</p>
          </div> },
        { h: "Order Booking Terms", p: <div className="space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders are confirmed only upon receipt of the required advance payment.</li>
              <li>Full payment timelines will be communicated at the time of booking.</li>
              <li>Prices are subject to change until an order is formally confirmed.</li>
              <li>Customisations are subject to ingredient availability and operational feasibility.</li>
              <li>Final guest counts, menu selections, and event details must be confirmed within the timeline communicated at the time of booking.</li>
              <li>Any last-minute changes may incur additional charges.</li>
              <li>Mezcla reserves the right to decline orders that cannot be fulfilled in accordance with our quality standards.</li>
            </ul>
          </div> }
      ]}
    />
  ),
});
