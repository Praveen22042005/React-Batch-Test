import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyCategory: "",
    domain: "",
    JDdate: "",
    description: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
    
    // Check if a company was selected in the CompanyList view
    const preselectedCompanyId = sessionStorage.getItem('selectedCompanyId');
    if (preselectedCompanyId) {
      setSelectedCompanyId(preselectedCompanyId);
      sessionStorage.removeItem('selectedCompanyId'); // Clean up
    }
  }, []);

  // When selectedCompanyId changes, load the company data
  useEffect(() => {
    if (selectedCompanyId && companies.length > 0) {
      const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId.toString());
      if (selectedCompany) {
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = selectedCompany.JDdate ? 
          new Date(selectedCompany.JDdate).toISOString().split('T')[0] : "";
          
        setCompanyData({
          companyName: selectedCompany.companyName || "",
          companyCategory: selectedCompany.companyCategory || "Service Based",
          domain: selectedCompany.domain || "",
          JDdate: formattedDate,
          description: selectedCompany.description || ""
        });
        setIsEditing(true);
      }
    }
  }, [selectedCompanyId, companies]);

  // Load companies from localStorage
  const loadCompanies = () => {
    const companiesJson = localStorage.getItem('companies');
    if (companiesJson) {
      const loadedCompanies = JSON.parse(companiesJson);
      setCompanies(loadedCompanies);
    }
  };

  // Handle company selection
  const handleCompanySelect = (e) => {
    const companyId = e.target.value;
    setSelectedCompanyId(companyId);
    
    if (!companyId) {
      setIsEditing(false);
      setCompanyData({
        companyName: "",
        companyCategory: "Service Based",
        domain: "",
        JDdate: "",
        description: ""
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value
    });
  };

  // Validate form before submission
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update the company in the array
      const updatedCompanies = companies.map(company => {
        if (company.id.toString() === selectedCompanyId) {
          return {
            ...company,
            companyName: companyData.companyName,
            companyCategory: companyData.companyCategory,
            domain: companyData.domain,
            JDdate: companyData.JDdate,
            description: companyData.description
          };
        }
        return company;
      });
      
      // Save updated companies to localStorage
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      setCompanies(updatedCompanies);
      
      // Show success message
      setFormSubmitted(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setIsEditing(false);
        setSelectedCompanyId("");
        navigate('/');
      }, 2000);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedCompanyId("");
    setErrors({});
  };

  return (
    <div className="create-container">
      <div className="modern-card">
        {formSubmitted ? (
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
            <h3>Company Updated!</h3>
            <p>Redirecting to home page...</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <div className="header-icon">✏️</div>
              <h2>Edit Company Details</h2>
            </div>
            
            <div className="company-selector">
              <label htmlFor="companySelect">Select a company to edit:</label>
              <select 
                id="companySelect" 
                value={selectedCompanyId} 
                onChange={handleCompanySelect}
                className="company-select"
              >
                <option value="">-- Select a company --</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
            
            {isEditing ? (
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
                  <button type="button" className="cancel-button" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    <span className="button-icon">✓</span>
                    Update Company
                  </button>
                </div>
              </form>
            ) : (
              <div className="empty-editor-state">
                <div className="empty-icon">📋</div>
                <p>Please select a company from the dropdown to edit its details.</p>
                <button className="return-home" onClick={() => navigate('/')}>
                  Return to Home
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Edit;