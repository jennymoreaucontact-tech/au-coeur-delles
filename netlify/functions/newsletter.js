exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { prenom, email } = JSON.parse(event.body);

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email manquant" }) };
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      email: email,
      attributes: { PRENOM: prenom || "" },
      listIds: [6],
      updateEnabled: true
    })
  });

  if (response.ok || response.status === 204) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } else {
    const error = await response.text();
    console.log("Brevo error:", error);
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
};
