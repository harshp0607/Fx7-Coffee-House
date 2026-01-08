# SMS Notifications Setup Guide - Vonage

Your app is now configured to send SMS notifications when orders are marked ready using Vonage (formerly Nexmo)!

## 🎉 Why Vonage?

- ✅ **NO minimum deposit** (pay only for what you use!)
- ✅ **Cheaper than Twilio** (~$0.0057 per SMS vs $0.0079)
- ✅ **$2 free trial credit**
- ✅ **Easy setup**
- ✅ **No verification restrictions** - send to any number immediately!

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Vonage Account (5 minutes)

1. Go to [Vonage Sign Up](https://dashboard.nexmo.com/sign-up)
2. Create a free account with your email
3. Verify your email address
4. You'll get **$2 free trial credit** (enough for ~350 messages!)

### Step 2: Get Your API Credentials (1 minute)

1. After logging in, you'll see the [Dashboard](https://dashboard.nexmo.com/)
2. Your credentials are right on the homepage:
   - **API Key** (8 characters, like `a1b2c3d4`)
   - **API Secret** (16 characters, click "Show" to reveal)
3. Copy these - you'll need them in Step 4

### Step 3: Get a Vonage Phone Number (3 minutes)

1. In the Vonage Dashboard, go to **Numbers** → **Buy numbers**
   - Or visit: https://dashboard.nexmo.com/buy-numbers
2. Select your country (e.g., United States)
3. Click **Search**
4. Choose any number from the list (they're all free to rent!)
5. Click **Buy**

**Important:** Your number will be in this format: `12025551234` (NO + sign)

### Step 4: Add Environment Variables to Vercel (3 minutes)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (fx7-coffee-house)
3. Go to **Settings** → **Environment Variables**
4. Add these 3 variables:

| Name | Value | Example |
|------|-------|---------|
| `VONAGE_API_KEY` | Your API Key from Step 2 | `a1b2c3d4` |
| `VONAGE_API_SECRET` | Your API Secret from Step 2 | `1a2b3c4d5e6f7g8h` |
| `VONAGE_PHONE_NUMBER` | Your Vonage number from Step 3 | `12025551234` |

**Important:**
- Vonage numbers do NOT include the `+` sign
- Just the digits: `12025551234` not `+12025551234`

5. Click **Save** for each variable

### Step 5: Redeploy Your App (1 minute)

After adding environment variables, redeploy:

**Option A: Via Git Push (Recommended)**
```bash
git add .
git commit -m "Switch to Vonage for SMS"
git push
```

**Option B: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots on your latest deployment
3. Click **Redeploy**

---

## 🧪 Testing SMS Notifications

### No Verification Needed!

Unlike Twilio, Vonage lets you send to **ANY phone number** immediately - no verification required! 🎉

### How to Test

1. Place an order with any phone number
2. Go to the admin panel
3. Mark the order as ready
4. You should receive an SMS within seconds!

Example SMS message:
```
Hi John! ☕

Your order is ready for pickup at FX7 Coffee House!

Order:
  • Peppermint Mocha (Large) - Hot
  • Gingerbread Latte (Medium) - Iced

Please come to the counter to pick up your order.

Thank you for supporting Feeding America with your purchase! 💚

- FX7 Coffee House
```

---

## 💰 Pricing

### After $2 Free Credit:

| Volume | Cost per SMS | Monthly Cost Example |
|--------|-------------|---------------------|
| 100 messages | $0.0057 | **$0.57/month** |
| 500 messages | $0.0057 | **$2.85/month** |
| 1,000 messages | $0.0057 | **$5.70/month** |

**No monthly fees** - only pay for messages you send!

### Number Rental:
- Most US numbers: **$0.90/month**
- Toll-free numbers: **$3-5/month**

---

## 🔍 How It Works

```
Customer places order
        ↓
Order marked ready
        ↓
Vercel API receives request (/api/send-sms)
        ↓
Vonage sends SMS to customer
        ↓
Customer receives notification!
```

The SMS is only sent if:
- Customer provided a phone number
- Phone number is in valid format
- Vonage credentials are configured

---

## 🐛 Troubleshooting

### SMS Not Sending?

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click on latest deployment
4. Check **Functions** tab for errors

**Common Issues:**

1. **"SMS service not configured"**
   - Make sure you added all 3 environment variables to Vercel
   - Redeploy after adding variables

2. **"Invalid phone number format"**
   - Customer phone must include country code: `+12025551234`
   - Vonage number should NOT include +: `12025551234`

3. **"Insufficient balance"**
   - Add credit to your Vonage account
   - Go to: https://dashboard.nexmo.com/billing-and-payments

### Still Having Issues?

Check Vonage logs:
1. Go to [Vonage Dashboard](https://dashboard.nexmo.com/)
2. Navigate to **Reports** → **SMS**
3. See all sent messages and any errors

---

## 📱 Phone Number Format Guide

**Customer phone numbers (in your app):**
- ✅ `+12025551234` (US)
- ✅ `+442071234567` (UK)
- ✅ `+61412345678` (Australia)

**Vonage sender number (in Vercel env vars):**
- ✅ `12025551234` (NO + sign)
- ❌ `+12025551234` (don't use +)

**Incorrect formats:**
- ❌ `2025551234` (missing country code)
- ❌ `(202) 555-1234` (has formatting)

---

## 🔒 Security Notes

- Never commit `.env` files to Git (already in `.gitignore`)
- Environment variables are secure in Vercel
- Vonage credentials are only accessible server-side
- API endpoint validates requests before sending

---

## 📊 Monitoring SMS Usage

Track your SMS usage in Vonage:
1. Go to [Vonage Dashboard](https://dashboard.nexmo.com/)
2. Navigate to **Reports** → **SMS**
3. See all sent messages, delivery status, and costs
4. Check your balance under **Billing and Payments**

---

## 💳 Adding Credit

When your $2 trial runs out:

1. Go to [Billing and Payments](https://dashboard.nexmo.com/billing-and-payments)
2. Click **Top up**
3. Add any amount (as low as $5)
4. No recurring charges - just add when needed!

---

## 🎉 You're All Set!

Once you complete these steps, customers will automatically receive SMS notifications when their orders are ready!

### Quick Setup Summary:
1. ✅ Sign up for Vonage (free)
2. ✅ Get API Key & Secret
3. ✅ Buy a phone number
4. ✅ Add 3 environment variables to Vercel
5. ✅ Redeploy your app
6. ✅ Test it out!

**Questions or issues?** Check the Vonage documentation: https://developer.vonage.com/messaging/sms/overview

---

## 📚 Additional Resources

- **Vonage Dashboard**: https://dashboard.nexmo.com/
- **API Documentation**: https://developer.vonage.com/messaging/sms/overview
- **Pricing**: https://www.vonage.com/communications-apis/sms/pricing/
- **Support**: https://api.support.vonage.com/
