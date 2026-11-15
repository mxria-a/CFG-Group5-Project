# Pickier — Phase 5: Customisation, Milestone 1

**Scope:** MySQL demo customisation catalogues + read-only options API + backend-validated price quotation.  
**Not in this ZIP:** React modal updates, basket integration, multi-item checkout, order history changes, deployment or database changes. Nothing in the ZIP runs automatically.

## Safety first

- Keep working on `feature/restaurant-menus` in `Group-5-Project` (project root).
- This ZIP contains no `.env`, secrets or database backup.
- **Never run `backend/Database/setup.sql` on your Aiven database.** It contains `DROP DATABASE`.
- Before running the migration, make a fresh **full database backup** in MySQL Workbench and verify that you have selected the correct Aiven schema. You previously backed up before migration 001, but that backup predates the 20 demo dishes; create a new one.
- **Do not run migration 002 until you have reviewed its SQL.** Do not run migration 001 again.
- No changes to the live Render backend are made until we deploy the updated backend route later.

## Files

| Path | Purpose |
| --- | --- |
| `backend/Database/migrations/002_item_customisation_options.sql` | Adds three tables and illustrative options for all eight food categories |
| `backend/routes/itemCustomisations.js` | GET item options and POST validated quotes |
| `backend/services/customisationPricing.js` | Validates selections and calculates monetary totals in integer pennies |
| `backend/services/customisationPricing.node.test.cjs` | Nine dependency-free unit tests |
| `backend/server.js` | Registers the new route beside the existing restaurant menu route |

## Step 1: Copy the code and run unit tests (no database writes)

From the **project root**, check your branch and worktree first:

```bash
git branch --show-current
git status --short
```

If you have important uncommitted edits, preserve them before extracting. Extract this ZIP into the **project root** (not `frontend/` or `backend/`).

Inspect changes:

```bash
git diff -- backend/server.js
git status --short
node --test backend/services/customisationPricing.node.test.cjs
```

Expected: 9 passing tests. These tests do not connect to Aiven or modify the database.

## Step 2: Review and back up Aiven

After making a fresh backup in MySQL Workbench, confirm the selected database:

```sql
SELECT DATABASE() AS selectedDatabase;
SELECT COUNT(*) AS existingDishes FROM items;
```

The dish count should be around 100 if the existing data has not changed. This is only a safety check; stop if you recognise the wrong database or unexpected data.

Read `backend/Database/migrations/002_item_customisation_options.sql` in full. It creates only **three new tables**: `item_customisation_sizes`, `item_customisation_removals`, `item_customisation_extras`. It does **not** delete or alter current menu items, orders or customers. Initial choices are demonstration data and not verified restaurant offerings.

### Sample data policy

- **Pizza:** Small = existing price − £1.50 (minimum £0.01), Medium = existing item price, Large = existing price + £3.00. Only pizza receives size choices in this milestone.
- **Removals:** Derived from the comma-separated ingredients already stored on each item, excluding common central ingredients like pizza dough/rice. The list is only illustrative; it does not establish restaurant capabilities or allergy safety.
- **Extras:** Example priced add-ons for every food category, chosen by category. Vegan-labelled base dishes are not offered the obviously non-vegan extras in this seed list. Actual product/allergen data would require restaurant verification.
- The SQL uses `CREATE TABLE IF NOT EXISTS` and skips previously seeded options. This is not a substitute for backing up before first execution.

Run migration 002 in MySQL Workbench **only after reviewing the SQL and creating the backup**. Its final read-only query lists how many size, removal and extra options were populated.

## Step 3: Verify the schema (read-only)

```sql
SELECT COUNT(*) AS sizes FROM item_customisation_sizes;
SELECT COUNT(*) AS removals FROM item_customisation_removals;
SELECT COUNT(*) AS extras FROM item_customisation_extras;
SELECT i.itemID, i.itemName, s.sizeName, s.price
FROM items i JOIN item_customisation_sizes s ON i.itemID = s.itemID
WHERE i.itemName = 'Margherita Pizza'
ORDER BY s.sortOrder;
```

For Margherita, if its medium/base price is still £9.00, you should see Small £7.50, Medium £9.00 and Large £12.00.

## API contract (after deployment)

**GET** `/items/:itemId/customisation-options` returns the restaurant/item info and arrays of `sizes`, `removals`, and `extras`; each option has a database ID. The API explicitly labels them demo options.

**POST** `/customisations/quote`

```json
{
  "itemId": 51,
  "sizeId": 2,
  "removalIds": [],
  "extraIds": [],
  "quantity": 2
}
```

Replace the example `itemId` and `sizeId` with **actual IDs returned by GET**. Restaurant ID and item ID are different identifiers. The response includes server-computed `unitPrice` and `totalPrice` as GBP strings, plus the chosen options. It ignores any client-submitted `price`. Invalid IDs, duplicate extras, mismatched options and quantity outside 1–10 receive HTTP 400.

## What comes next

1. Confirm database migration was successful, without exposing database credentials.
2. Deploy **only these backend changes** via a dedicated backend-only pull request to `main` (as we did for the restaurant menus); do not merge the unfinished frontend branch.
3. Verify the live GET/POST endpoints.
4. Replace the hardcoded `getDemoOptions` data in the existing "Make it yours" React modal with GET data, including the pizza size selector and quote validation.
5. Upgrade the basket, checkout, order storage and order history to support distinct customised lines and multiple dishes, maintaining the backend as source of truth for prices.

**Current limitation:** This milestone does **not** make customised items eligible for checkout yet. The existing checkout restriction must remain until the order-writing backend has been implemented and tested. The app is an independent portfolio demo and does not transmit orders to restaurants.
