import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmailTemplate = ({
  name,
  email,
  message,
}: ContactEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>New Inquiry from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>Meiris Contact Request</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={paragraph}>
            You have received a new message from the website contact form.
          </Text>
          
          <Section style={detailsContainer}>
            <Text style={detailLabel}>Name</Text>
            <Text style={detailValue}>{name}</Text>
            
            <Text style={detailLabel}>Email</Text>
            <Text style={detailValue}>{email}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={detailLabel}>Message</Text>
          <Text style={messageText}>
            {message.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} Meiris. This message was automatically generated from your website.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "0",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#111111", // Dark header based on the website's dark nav
  padding: "30px 40px",
  borderBottom: "4px solid #10b981", // Emerald green accent line from the screenshot
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "40px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
};

const detailsContainer = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "6px",
  marginBottom: "24px",
};

const detailLabel = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
  letterSpacing: "0.5px",
};

const detailValue = {
  color: "#334155",
  fontSize: "16px",
  margin: "0 0 16px",
  fontWeight: "500",
};

const messageText = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "30px 0",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px 40px",
  borderTop: "1px solid #e2e8f0",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: "0",
};
