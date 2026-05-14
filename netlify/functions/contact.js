exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { prenom, email, message } = JSON.parse(event.body);

  if (!prenom || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: "Champs manquants" }) };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: prenom, email: "Jennymoreau.contact@gmail.com" },
      to: [{ email: "Jennymoreau.contact@gmail.com", name: "Jenny Moreau-Sonko" }],
      replyTo: { email: email, name: prenom },
      subject: `Nouveau message de ${prenom} via Au cœur d'elles`,
      htmlContent: `<h2>Nouveau message</h2><p><strong>Prénom :</strong> ${prenom}</p><p><strong>Email :</strong> ${email}</p><p><strong>Message :</strong> ${message}</p>`
    })
  });

  if (response.ok) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } else {
    const error = await response.text();
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
};
