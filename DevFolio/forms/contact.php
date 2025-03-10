<?php
// Replace with the correct path to config file
$config = require_once '../../mail-config.php';

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Include PHPMailer files directly
    require_once 'PHPMailer/src/Exception.php';
    require_once 'PHPMailer/src/PHPMailer.php';
    require_once 'PHPMailer/src/SMTP.php';
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->SMTPDebug = 0;                       // Set to 0 in production
        $mail->isSMTP();                            // Send using SMTP
        $mail->Host       = $config['smtp']['host'];      // SMTP server
        $mail->SMTPAuth   = true;                   // Enable SMTP authentication
        $mail->Username   = $config['smtp']['username']; // From config file
        $mail->Password   = $config['smtp']['password']; // From config file
        $mail->SMTPSecure = $config['smtp']['secure'];   // Enable TLS encryption
        $mail->Port       = $config['smtp']['port'];     // TCP port to connect to
        
        // Recipients
        $mail->setFrom($_POST['email'], $_POST['name']);
        $mail->addAddress($config['smtp']['username']);  // Add a recipient
        $mail->addReplyTo($_POST['email'], $_POST['name']);
        
        // Content
        $mail->isHTML(true);                       // Set email format to HTML
        $mail->Subject = $_POST['subject'];
        
        // Create HTML message body
        $message = '<h3>New message from your website contact form</h3>';
        $message .= '<p><strong>Name:</strong> ' . htmlspecialchars($_POST['name']) . '</p>';
        $message .= '<p><strong>Email:</strong> ' . htmlspecialchars($_POST['email']) . '</p>';
        $message .= '<p><strong>Subject:</strong> ' . htmlspecialchars($_POST['subject']) . '</p>';
        $message .= '<p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($_POST['message'])) . '</p>';
        
        $mail->Body    = $message;
        $mail->AltBody = strip_tags($message);
        
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Your message has been sent. Thank you!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
    exit;
}
?>