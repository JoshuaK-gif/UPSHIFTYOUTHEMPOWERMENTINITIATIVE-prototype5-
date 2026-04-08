   const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    });
  
  
  
  
  const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shrink', window.scrollY > 60);
    }, { passive: true });

    // Hamburger
    const toggle  = document.getElementById('navToggle');
    const mobileM = document.getElementById('mobileMenu');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileM.classList.toggle('open');
    }, { passive: true });

    mobileM.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileM.classList.remove('open');
      });
    }, { passive: true });


// ============================================================
// CONFIGURATION — update these values
// ============================================================
var FLW_PUBLIC_KEY = "FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXX-X"; // Your Flutterwave public key
var ORG_NAME       = "Upshift Youth Empowerment Initiative";
var ORG_EMAIL      = "donate@upshiftyouthempowermentinitiative.org";
var PROCESSING_FEE = 0.87;

// ============================================================
// STATE
// ============================================================
var selectedAmount  = 25;
var selectedPayment = "visa";
var usingOther      = false;

// ============================================================
// FREQUENCY & DONOR TYPE TOGGLES
// ============================================================
function setActive(groupId, btn) {
  var group = document.getElementById(groupId);
  group.querySelectorAll(".toggle-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
}

// ============================================================
// AMOUNT SELECTION
// ============================================================
function selectAmount(btn, amount) {
  // Deactivate Other
  usingOther = false;
  document.getElementById("otherWrap").style.display = "none";
  document.getElementById("otherBtn").classList.remove("active");
  document.getElementById("otherInput").value = "";

  // Activate clicked preset
  document.querySelectorAll(".amount-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  selectedAmount = amount;
}

function toggleOther() {
  usingOther = !usingOther;
  var wrap = document.getElementById("otherWrap");
  var btn  = document.getElementById("otherBtn");

  if (usingOther) {
    wrap.style.display = "flex";
    btn.classList.add("active");
    // Deselect preset buttons
    document.querySelectorAll(".amount-btn").forEach(function(b) {
      b.classList.remove("active");
    });
    selectedAmount = 0;
    document.getElementById("otherInput").focus();
  } else {
    wrap.style.display = "none";
    btn.classList.remove("active");
    selectedAmount = 25;
    // Reactivate first preset
    var first = document.querySelector(".amount-btn");
    if (first) first.classList.add("active");
  }
}

function onOtherInput() {
  var val = parseFloat(document.getElementById("otherInput").value);
  selectedAmount = isNaN(val) || val < 1 ? 0 : val;
}

// ============================================================
// PAYMENT METHOD SELECTION
// ============================================================
function selectPayment(tile, method) {
  document.querySelectorAll(".pm-tile").forEach(function(t) {
    t.classList.remove("active");
  });
  tile.classList.add("active");
  selectedPayment = method;

  // Show correct panel
  document.querySelectorAll(".panel").forEach(function(p) {
    p.classList.remove("active");
  });
  var panel = document.getElementById("panel-" + method);
  if (panel) panel.classList.add("active");
}

// ============================================================
// CARD FORMATTING
// ============================================================
function formatCard(input) {
  var v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(input) {
  var v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) {
    input.value = v.substring(0, 2) + " / " + v.substring(2);
  } else {
    input.value = v;
  }
}

// ============================================================
// TOTAL AMOUNT HELPER
// ============================================================
function getTotalAmount() {
  var base  = selectedAmount;
  var addFee = document.getElementById("processingCheck").checked;
  return addFee ? base + PROCESSING_FEE : base;
}

// ============================================================
// DONATE BUTTON — main handler
// ============================================================
function handleDonate() {
  // 1. Validate amount
  if (!selectedAmount || selectedAmount < 1) {
    alert("Please enter or select a valid donation amount.");
    return;
  }

  // 2. Route by payment method
  if (selectedPayment === "bank") {
    alert("Please complete the bank transfer using the details shown, then email your receipt to " + ORG_EMAIL);
    return;
  }

  if (selectedPayment === "gofundme") {
    window.open("https://www.gofundme.com", "_blank");
    return;
  }

  // 3. Visa / Mastercard → validate card fields then launch Flutterwave
  var panel  = document.getElementById("panel-" + selectedPayment);
  var inputs = panel.querySelectorAll(".field-input");
  var name   = inputs[0].value.trim();
  var cardNo = inputs[1].value.replace(/\s/g, "");
  var expiry = inputs[2].value.trim();
  var cvv    = inputs[3].value.trim();

  if (!name)              { alert("Please enter cardholder name.");   return; }
  if (cardNo.length < 16) { alert("Please enter a valid card number."); return; }
  if (!expiry)            { alert("Please enter expiry date.");        return; }
  if (!cvv)               { alert("Please enter CVV.");                return; }

  launchFlutterwave(name);
}

// ============================================================
// FLUTTERWAVE INLINE PAYMENT
// ============================================================
function launchFlutterwave(cardholderName) {
  var total      = getTotalAmount();
  var frequency  = document.querySelector("#freqGroup .toggle-btn.active").textContent;
  var donorType  = document.querySelector("#donorGroup .toggle-btn.active").textContent;
  var dedication = document.getElementById("dedicateCheck").checked ? "Yes" : "No";

  // FlutterwaveCheckout is loaded from the CDN script tag you add to your HTML
  FlutterwaveCheckout({
    public_key: FLW_PUBLIC_KEY,
    tx_ref:     "USYEI-" + Date.now(),
    amount:     total,
    currency:   "USD",
    country:    "UG",

    // Customer info — ideally collect email/phone in a visible field
    customer: {
      email:       ORG_EMAIL,   // replace with a collected donor email field
      name:        cardholderName,
      phonenumber: ""
    },

    meta: {
      frequency:  frequency,
      donor_type: donorType,
      dedication: dedication
    },

    customizations: {
      title:       ORG_NAME,
      description: "Donation to " + ORG_NAME,
      logo:        "https://upshiftyouthempowermentinitiative-p-seven.vercel.app/images/logo.png"
    },

    callback: function(response) {
      // response.status === "successful" or "failed"
      if (response.status === "successful") {
        alert("Thank you! Your donation of $" + total.toFixed(2) + " was received. Transaction ID: " + response.transaction_id);
        // Optionally send to Make.com webhook here for Google Sheets + Brevo
        notifyMakeWebhook(response, total, cardholderName);
      } else {
        alert("Payment was not completed. Please try again.");
      }
    },

    onclose: function() {
      console.log("Flutterwave modal closed.");
    }
  });
}

// ============================================================
// OPTIONAL: Send donation record to Make.com → Google Sheets + Brevo
// ============================================================
var MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/YOUR_WEBHOOK_ID"; // your Make.com webhook

function notifyMakeWebhook(flwResponse, amount, donorName) {
  var payload = {
    donor_name:      donorName,
    amount:          amount,
    currency:        "USD",
    transaction_id:  flwResponse.transaction_id,
    frequency:       document.querySelector("#freqGroup .toggle-btn.active").textContent,
    donor_type:      document.querySelector("#donorGroup .toggle-btn.active").textContent,
    payment_method:  selectedPayment,
    date:            new Date().toISOString()
  };

  fetch(MAKE_WEBHOOK_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  }).catch(function(err) {
    console.error("Make.com webhook error:", err);
  });
}