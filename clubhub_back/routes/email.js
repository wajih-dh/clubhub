const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email route with enhanced error handling
router.post('/send-registration-email', async (req, res) => {
  try {
    console.log('📧 Email request received:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const { to, userName, eventDetails } = req.body;
    
    if (!to) {
      console.error('❌ Missing recipient email address');
      return res.status(400).json({ message: 'Missing recipient email address' });
    }
    
    if (!userName) {
      console.error('❌ Missing user name');
      return res.status(400).json({ message: 'Missing user name' });
    }
    
    if (!eventDetails) {
      console.error('❌ Missing event details');
      return res.status(400).json({ message: 'Missing event details' });
    }
    
    // Format the date safely
    let formattedDate = 'Date not specified';
    try {
      if (eventDetails.date) {
        const eventDate = new Date(eventDetails.date);
        formattedDate = eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch (error) {
      console.error('⚠️ Error formatting date:', error.message);
      // Continue with the original date string if formatting fails
      formattedDate = eventDetails.date || 'Date not specified';
    }
    
    // Create email HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
          <h1 style="margin: 0;">Event Registration Confirmation</h1>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Hello ${userName},</p>
          
          <p style="font-size: 16px;">Thank you for registering for the following event:</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #6a11cb; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #2c3e50; margin-top: 0;">${eventDetails.title || 'Event'}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${eventDetails.time || 'Time not specified'}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${eventDetails.location || "TBA"}</p>
            ${eventDetails.description ? `<p style="margin: 10px 0;"><strong>Description:</strong> ${eventDetails.description}</p>` : ""}
          </div>
          
          <p style="font-size: 16px;">We're looking forward to seeing you there! If you have any questions or need to cancel your registration, please contact us.</p>
          
          <p style="font-size: 16px;">Best regards,<br>The ClubHub Team</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #7f8c8d;">
          <p>This is an automated message from ClubHub. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    console.log('🔄 Setting up email transporter...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wajihdhifli27@gmail.com",
        pass: "mtkfcvwbxbnnwcfc"
      },
      debug: true, // Enable debug output
      logger: true // Log information about the mail
    });
    
    console.log('✅ Transporter created, verifying connection...');
    
    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:', verifyError.message);
      
      // Check for common Gmail authentication errors
      if (verifyError.message.includes('Invalid login')) {
        console.error('❌ GMAIL AUTHENTICATION ERROR: Invalid login credentials');
        return res.status(500).json({ 
          message: "Email service authentication failed", 
          error: "Gmail rejected the login credentials. Please check your email and password."
        });
      }
      
      if (verifyError.message.includes('Access denied')) {
        console.error('❌ GMAIL ACCESS DENIED: Less secure app access might be disabled');
        return res.status(500).json({ 
          message: "Email service access denied", 
          error: "Gmail blocked access. Enable 'Less secure app access' or create an App Password."
        });
      }
      
      if (verifyError.message.includes('security')) {
        console.error('❌ GMAIL SECURITY ISSUE: Gmail blocked the sign-in attempt');
        return res.status(500).json({ 
          message: "Email service security issue", 
          error: "Gmail blocked the sign-in attempt for security reasons. Check your Gmail inbox for security alerts."
        });
      }
      
      // Continue anyway for testing purposes, but log the warning
      console.warn('⚠️ Continuing despite SMTP verification failure');
    }
    
    console.log('📤 Attempting to send email to:', to);
    
    // Prepare email
    const mailOptions = {
      from: '"ClubHub" <wajihdhifli27@gmail.com>',
      to,
      subject: `Registration Confirmation: ${eventDetails.title || 'Event'}`,
      html: htmlContent,
    };
    
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully! Message ID:', info.messageId);
      res.status(200).json({ 
        message: "Email sent successfully", 
        messageId: info.messageId 
      });
    } catch (sendError) {
      console.error('❌ Error sending email:', sendError);
      
      // Check for specific Gmail errors
      if (sendError.message.includes('Invalid login')) {
        console.error('❌ GMAIL AUTHENTICATION ERROR: Invalid login credentials');
        return res.status(500).json({ 
          message: "Failed to send email", 
          error: "Gmail rejected the login credentials. Please check your email and password."
        });
      }
      
      if (sendError.message.includes('Access denied') || sendError.message.includes('Username and Password not accepted')) {
        console.error('❌ GMAIL ACCESS DENIED: Less secure app access might be disabled');
        return res.status(500).json({ 
          message: "Failed to send email", 
          error: "Gmail blocked access. Enable 'Less secure app access' or create an App Password."
        });
      }
      
      if (sendError.message.includes('security') || sendError.message.includes('blocked')) {
        console.error('❌ GMAIL SECURITY ISSUE: Gmail blocked the sign-in attempt');
        return res.status(500).json({ 
          message: "Failed to send email", 
          error: "Gmail blocked the sign-in attempt for security reasons. Check your Gmail inbox for security alerts."
        });
      }
      
      // Generic error response
      res.status(500).json({ 
        message: "Failed to send email", 
        error: sendError.message
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error in email route:', error);
    res.status(500).json({ 
      message: "Server error while processing email request", 
      error: error.message
    });
  }
});

module.exports = router;