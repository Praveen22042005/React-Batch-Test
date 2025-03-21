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
    description: "",
    headquarters: "",
    foundedYear: "",
    employeeCount: "",
    jobOpenings: [
      { title: "", department: "", location: "", experience: "", salary: "" }
    ]
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value
    });
  };

  const handleJobOpeningChange = (index, e) => {
    const { name, value } = e.target;
    const updatedJobOpenings = [...companyData.jobOpenings];
    updatedJobOpenings[index] = {
      ...updatedJobOpenings[index],
      [name]: value
    };
    
    setCompanyData({
      ...companyData,
      jobOpenings: updatedJobOpenings
    });
  };

  const addJobOpening = () => {
    setCompanyData({
      ...companyData,
      jobOpenings: [
        ...companyData.jobOpenings,
        { title: "", department: "", location: "", experience: "", salary: "" }
      ]
    });
  };

  const removeJobOpening = (index) => {
    if (companyData.jobOpenings.length > 1) {
      const updatedJobOpenings = companyData.jobOpenings.filter((_, i) => i !== index);
      setCompanyData({
        ...companyData,
        jobOpenings: updatedJobOpenings
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!companyData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    
    if (!companyData.domain.trim()) {
      newErrors.domain = "Domain is required";
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(companyData.domain) && 
               !/^https?:\/\//.test(companyData.domain)) {
      newErrors.domain = "Please enter a valid domain";
    }
    
    if (!companyData.JDdate) {
      newErrors.JDdate = "JD date is required";
    }

    // Validate job openings
    companyData.jobOpenings.forEach((job, index) => {
      if (!job.title.trim()) {
        newErrors[`jobTitle${index}`] = "Job title is required";
      }
      if (!job.department.trim()) {
        newErrors[`jobDepartment${index}`] = "Department is required";
      }
    });
    
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
      <div className="card form-card">
        <div className="card-header">
          <h2>Create a New Company Entry</h2>
          <p className="subtitle">Add a new company and its job openings</p>
        </div>
        
        {formSubmitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Company Added Successfully!</h3>
            <p>Redirecting to home page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-section">
              <h3 className="section-title">Company Information</h3>
              
              <div className="form-group">
                <label htmlFor="companyName">Company Name*</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleInputChange}
                  className={errors.companyName ? "error" : ""}
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyCategory">Category*</label>
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
                
                <div className="form-group">
                  <label htmlFor="JDdate">JD Date*</label>
                  <input
                    type="date"
                    id="JDdate"
                    name="JDdate"
                    value={companyData.JDdate}
                    onChange={handleInputChange}
                    className={errors.JDdate ? "error" : ""}
                  />
                  {errors.JDdate && <span className="error-message">{errors.JDdate}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="domain">Domain/Website*</label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  placeholder="example.com or https://example.com"
                  value={companyData.domain}
                  onChange={handleInputChange}
                  className={errors.domain ? "error" : ""}
                />
                {errors.domain && <span className="error-message">{errors.domain}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="headquarters">Headquarters</label>
                  <input
                    type="text"
                    id="headquarters"
                    name="headquarters"
                    value={companyData.headquarters}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="foundedYear">Founded Year</label>
                  <input
                    type="number"
                    id="foundedYear"
                    name="foundedYear"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={companyData.foundedYear}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeCount">Employees</label>
                  <input
                    type="text"
                    id="employeeCount"
                    name="employeeCount"
                    placeholder="e.g. 100-500"
                    value={companyData.employeeCount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Company Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={companyData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">Job Openings</h3>
                <button 
                  type="button" 
                  className="add-btn"
                  onClick={addJobOpening}
                >
                  Add Job
                </button>
              </div>
              
              {companyData.jobOpenings.map((job, index) => (
                <div key={index} className="job-card">
                  <div className="job-header">
                    <h4>Job Opening #{index + 1}</h4>
                    {companyData.jobOpenings.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeJobOpening(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`title${index}`}>Job Title*</label>
                      <input
                        type="text"
                        id={`title${index}`}
                        name="title"
                        value={job.title}
                        onChange={(e) => handleJobOpeningChange(index, e)}
                        className={errors[`jobTitle${index}`] ? "error" : ""}
                      />
                      {errors[`jobTitle${index}`] && (
                        <span className="error-message">{errors[`jobTitle${index}`]}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`department${index}`}>Department*</label>
                      <input
                        type="text"
                        id={`department${index}`}
                        name="department"
                        value={job.department}
                        onChange={(e) => handleJobOpeningChange(index, e)}
                        className={errors[`jobDepartment${index}`] ? "error" : ""}
                      />
                      {errors[`jobDepartment${index}`] && (
                        <span className="error-message">{errors[`jobDepartment${index}`]}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`location${index}`}>Location</label>
                      <input
                        type="text"
                        id={`location${index}`}
                        name="location"
                        value={job.location}
                        onChange={(e) => handleJobOpeningChange(index, e)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`experience${index}`}>Experience</label>
                      <input
                        type="text"
                        id={`experience${index}`}
                        name="experience"
                        placeholder="e.g. 2-4 years"
                        value={job.experience}
                        onChange={(e) => handleJobOpeningChange(index, e)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`salary${index}`}>Salary Range</label>
                      <input
                        type="text"
                        id={`salary${index}`}
                        name="salary"
                        placeholder="e.g. $80K-$100K"
                        value={job.salary}
                        onChange={(e) => handleJobOpeningChange(index, e)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Company
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Create;