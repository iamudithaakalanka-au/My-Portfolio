// Navbar toggle
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

// Initialize EmailJS
emailjs.init("s4RKicvVJnwgBIAbU");

// Vue app
const { createApp } = Vue;

createApp({
    data() {
        return {
            userName: "",
            userEmail: "",
            userMessage: "",
            formMessage: "",
            messageType: ""
        }
    },
    methods: {
        async submitForm() {
            if (!this.userName || !this.userEmail || !this.userMessage) {
                this.showMessage("Please fill in all fields", "error");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.userEmail)) {
                this.showMessage("Please enter a valid email address", "error");
                return;
            }

            try {
                const result = await emailjs.send(
                    "service_a91vdln",
                    "template_a8cibm8",
                    {
                        user_name: this.userName,
                        user_email: this.userEmail,
                        message: this.userMessage,
                        reply_to: this.userEmail
                    }
                );

                console.log("Email sent:", result);
                this.showMessage("Message sent successfully!", "success");

                this.userName = "";
                this.userEmail = "";
                this.userMessage = "";

            } catch (error) {
                console.error("Email send error:", error);
                this.showMessage("Failed to send message. Please try again.", "error");
            }
        },
        showMessage(message, type) {
            this.formMessage = message;
            this.messageType = type;

            setTimeout(() => {
                this.formMessage = "";
                this.messageType = "";
            }, 5000);
        }
    }
}).mount("#contactApp");
