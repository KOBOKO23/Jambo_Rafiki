# How to Update Jambo Rafiki Footer Details in the Backend

To ensure the website footer displays the correct contact information, update the organization details in your backend as follows:

## API Endpoint
- **URL:** `https://<your-backend-domain>/organization/`
- **Method:** `PUT` or `PATCH`
- **Authentication:** Admin credentials or API token required

## Fields to Update
- `contact.email`: Set to `info@jamborafiki.org`
- `contact.call_redirect_number`: Set to your call number (e.g., `+254799616542`)
- `contact.call_redirect_url`: Set to `tel:+254799616542`
- Remove or clear any fields for old emails (like `hopenationsministries8@gmail.com` or `infodirector@...`)
- Remove or clear any bank account details you do not want displayed

## Example JSON Payload
```json
{
  "contact": {
    "email": "info@jamborafiki.org",
    "call_redirect_number": "+254799616542",
    "call_redirect_url": "tel:+254799616542"
  },
  "bank_account": {
    "account_name": "",
    "account_number": ""
  }
}
```

## Steps
1. Log in to your backend admin panel or use an API client (like Postman).
2. Send a `PUT` or `PATCH` request to `/organization/` with the updated fields.
3. Save changes and redeploy if necessary.
4. Redeploy your frontend if needed.

---

Replace `<your-backend-domain>` with your actual backend URL (e.g., `api.jamborafiki.org`).
