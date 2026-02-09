import React from 'react';
import "./Help.css";


const Help = () => {



    
    const faqs = [
        {
            question: "What is Ascendly?",
            answer: "Ascendly is a platform designed to help you achieve your goals efficiently."
        },
        {
            question: "How can I contact support?",
            answer: "You can contact support by emailing support@ascendly.com."
        },
        {
            question: "Is Ascendly free to use?",
            answer: "Ascendly offers both free and premium plans to suit your needs."
        },
        {
            question: "How do I reset my password?",
            answer: "You can reset your password by clicking on 'Forgot Password' on the login page."
        },
        {        question: "Can I upgrade my plan later?",
            answer: "Yes, you can upgrade your plan at any time from your account settings."
        },
        {     question: "What features are included in the premium plan?",
            answer: "The premium plan includes advanced analytics, priority support, and access to exclusive content."
        }
    ];

    return (
        <div className="help-page">
          <h1>Help & FAQs</h1>
    
          {faqs.map((faq, index) => (
            <div key={index} className="help-faq">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>


      );
    };

export default Help;