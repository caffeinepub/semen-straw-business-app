# Specification

## Summary
**Goal:** Add straw color code tracking and sale bill/invoice generation functionality to the Semen Straw Manager application.

**Planned changes:**
- Add a colorCode field to the SemenStraw data model in the backend
- Update AddStrawForm and EditStrawForm components to include a color code input field
- Display the color code in a new column in the inventory table
- Add a backend function to generate sale bills/invoices with complete sale details
- Add a "Generate Bill" button to each sale record in the SalesHistory page
- Create a printable invoice/bill component with professional layout showing sale details, buyer information, straw details including color code, quantity, and pricing

**User-visible outcome:** Users can now track the color code for each semen straw in their inventory. They can also generate and print professional sale bills/invoices for any sale transaction directly from the sales history page.
