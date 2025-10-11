import { Resend } from "resend";
import { NextResponse } from "next/server";
import { EmailTemplate } from '../../../components/EmailTemplate';


const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function POST(req: Request) {
  // Check if API key is properly configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "dummy-key") {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { name, email, message } = body;

  try {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['aob55992@gmail.com'],
        subject: `Portfolio Response from ${name}`,
        react: EmailTemplate({ name: name, email: email, message: message }),
      });
    return NextResponse.json({ status: "OK", data });
  } catch (error) {
    
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


