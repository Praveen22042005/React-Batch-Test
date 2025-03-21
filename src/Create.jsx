import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyCategory: "Service Based",
    domain: "",
    JDdate: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!companyData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    
    if (!companyData.domain.trim()) {
      newErrors.domain = "Domain is required";
    }
    
    if (!companyData.JDdate) {
      newErrors.JDdate = "JD date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Generate a unique ID for the new company
      const newCompany = {
        ...companyData,
        id: Date.now(),
      };
      
      // Get existing companies from localStorage
      const existingCompaniesJson = localStorage.getItem('companies');
      const existingCompanies = existingCompaniesJson ? JSON.parse(existingCompaniesJson) : [];
      
      // Add new company
      const updatedCompanies = [...existingCompanies, newCompany];
      
      // Save back to localStorage
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      
      // Show success message
      setFormSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="create-container">
      <div className="modern-card">
        {formSubmitted ? (
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h3>Company Added!</h3>
            <p>Redirecting to home page...</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <div className="header-icon">🏢</div>
              <h2>Add New Company</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label htmlFor="companyName">
                  <span className="label-text">Company Name</span>
                  <span className="required-star">*</span>
                </label>
                <div className="input-container">
                  <span className="input-icon">🏢</span>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={companyData.companyName}
                    onChange={handleInputChange}
                    className={errors.companyName ? "error" : ""}
                  />
                </div>
                {errors.companyName && <span className="error-text">{errors.companyName}</span>}
              </div>
              
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="companyCategory">
                    <span className="label-text">Category</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-container select-container">
                    <span className="input-icon">🔖</span>
                    <select
                      id="companyCategory"
                      name="companyCategory"
                      value={companyData.companyCategory}
                      onChange={handleInputChange}
                    >
                      <option value="Service Based">Service Based</option>
                      <option value="Product Based">Product Based</option>
                    </select>
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="JDdate">
                    <span className="label-text">JD Date</span>
                    <span className="required-star">*</span>
                  </label>
                  <div className="input-container">
                    <span className="input-icon">📅</span>
                    <input
                      type="date"
                      id="JDdate"
                      name="JDdate"
                      value={companyData.JDdate}
                      onChange={handleInputChange}
                      className={errors.JDdate ? "error" : ""}
                    />
                  </div>
                  {errors.JDdate && <span className="error-text">{errors.JDdate}</span>}
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="domain">
                  <span className="label-text">Website</span>
                  <span className="required-star">*</span>
                </label>
                <div className="input-container">
                  <span className="input-icon">🌐</span>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    placeholder="example.com"
                    value={companyData.domain}
                    onChange={handleInputChange}
                    className={errors.domain ? "error" : ""}
                  />
                </div>
                {errors.domain && <span className="error-text">{errors.domain}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="description">
                  <span className="label-text">Description</span>
                </label>
                <div className="input-container textarea-container">
                  <span className="input-icon textarea-icon">📝</span>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Brief description of the company"
                    value={companyData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  <span className="button-icon">✓</span>
                  Create Company
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Create;