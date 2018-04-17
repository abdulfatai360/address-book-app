/* 
Address Book App Initialization
------------------------------------------------------------------ */
// Toggles Between App's Different Viewport
const appRoot           = document.querySelector('.app-content');
const appContactForm    = document.querySelector('.app-contact-form');
const appContactDetails = document.querySelector('.app-contact-details');
const contactForm       = document.querySelector('.contact-form');
const previewDiv        = document.querySelector('.preview-div');

const view = {
  landingPage: function() {
    appRoot.classList.remove('show-contact-form');
    appRoot.classList.remove('show-contact-details');
    appRoot.classList.add('show-landing-page');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },
  contactForm: function() {
    contactForm.firstName.focus();
    if (!contactForm.image.files.length || !contactForm.image.files[0].type.startsWith('image/')) {
      previewDiv.innerHTML = '<p>Please select an image file for upload.</p>';
    }
    appRoot.classList.remove('show-landing-page');
    appRoot.classList.remove('show-contact-details');
    appRoot.classList.add('show-contact-form');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },
  contactDetails: function() {
    appRoot.classList.remove('show-landing-page');
    appRoot.classList.remove('show-contact-form');
    appRoot.classList.add('show-contact-details');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
};

// Resets the Contents of App Viewports to Default
const contactList  = document.querySelector('.contact-list');
const contactImage = document.querySelector('.contact-img img');
const contactName  = document.querySelector('.contact-name');
const contactPhone = document.querySelector('.contact-phone');
const contactEmail = document.querySelector('.contact-email');

const reset = {
  landingPage: function() {
    // code to reset landing page
  },
  contactForm: function() {
    const filesArr   = Array.from(contactForm.image.files);
    const formNotify = document.querySelector('.form-notify');
    const formInputs = document.querySelectorAll('.contact-form input');

    formNotify.style.display = 'none';
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].classList.remove('error');      
    };
    contactForm.contactId.value = 0;
    contactForm.reset();
    filesArr.splice(0, this.length);
    previewDiv.innerHTML = '';
    view.landingPage();
  },
  contactDetails: function() {
    contactName.textContent  = '';
    contactPhone.textContent = '';
    contactEmail.textContent = '';
    contactImage.src         = 'images/contact-img-placeholder.png';
    contactImage.src.alt     = 'Contact Image Placeholder';
    contactImage.title       = 'Contact';
  }
};

// Toggle "no-contact-msg" Content
const appHero = document.querySelector('.app-hero');
const heroMsg = document.querySelector('.hero-msg');

function _checkContactsList() {
  const noContactMsg = document.querySelector('.no-contact-msg');
  if (contactList.firstChild) {
    if (noContactMsg) {
      noContactMsg.remove(this.firstChild);
    } else {
      return;
    }
  } else {
    if (noContactMsg) {
      return;
    } else {
      const para = document.createElement('p');
      para.classList.add('no-contact-msg');
      para.setAttribute('id', 'no-contact-msg');
      para.textContent = 'Unfortunately, you do not have a contact yet. Your Contacts\' List is empty.';
      appHero.insertBefore(para, heroMsg.nextSibling);
    }
  }
}

// Toggle Viewport to Contact Form with 'Add Contact' Button
const addContactBtn = document.querySelector('.add-contact-btn');
addContactBtn.addEventListener('click', view.contactForm);

/* 
Contact Form Initialization
----------------------------------------------------------------- */
// Toggles View to Landing Page with Contact Form 'Close' Button
const cFormCloseBtn = document.querySelector('#cform-close-btn');
cFormCloseBtn.addEventListener('click', reset.contactForm);

// Handles Value of Contact Image's SRC Attribute
function _imageHandler(objArr) {
  window.URL       = window.URL || window.webkitURL;
  const selectFile = objArr[0];
  if (objArr.length) {
    if (selectFile.type.startsWith('image/')) {
      return window.URL.createObjectURL(selectFile);
    } else {
      return 'images/contact-img-placeholder.png';
    }
  } else {
    return 'images/contact-img-placeholder.png';
  }
}

// Check if Contact Form is Filled or Empty
function _isFormFilled(obj) {
  if (obj.firstName && obj.lastName && obj.phone && obj.email && (obj.image === 'images/contact-img-placeholder.png' || contactForm.image.files[0].type.startsWith('image/'))) {
    return true;
  } else {
    return false;
  }
}

// Validate Text Input
function _isNameValid(str) {
  const pattern = /[^A-Za-z\-]/;
  if (pattern.test(str)) return false; // Non-word character match
  return true; // No non-word character match
}

// Validate Phone Input
function _isPhoneValid(str) {
  const pattern = /(?:\d{2}[-\s]\d{7})|(?:0\d{10})/;
  if (pattern.test(str)) return true;
  return false;
}

// Validate Image Input MIME Type
function _isImageValid(str) {
  const fileType = ['image/jpeg', 'image/jpg', 'image/png'];
  for (let i = 0; i < fileType.length; i++) {
    if (str === fileType[i]) { return true };
  }
  return false;
}

// Validate all Form Data
function _isDataValid(obj) {
  if (_isNameValid(obj.firstName) && _isNameValid(obj.lastName) && _isPhoneValid(obj.phone)) {
    return true;
  } else {
    return false;
  }
}

// Populate Form Error List
const formNotify         = document.querySelector('.form-notify');
const errorList          = document.querySelector('.error-list');
formNotify.style.display = 'none';
function _writeError(str) {
  if (formNotify.style.display === 'none') formNotify.style.display = 'block';
  const error = document.createElement('li');
  error.classList.add('error');
  error.style.listStyleType = 'square';
  error.textContent         = str;
  errorList.appendChild(error);
}

// Contact Form Submission Initialization
let contactData;
function _contactFormInit(event) {
  event.preventDefault();
  contactData = {
    id       : parseInt(contactForm.contactId.value),
    firstName: contactForm.firstName.value,
    lastName : contactForm.lastName.value,
    phone    : contactForm.phone.value,
    email    : contactForm.email.value,
    image    : _imageHandler(contactForm.image.files)
  };

  if (_isFormFilled(contactData) && _isDataValid(contactData)) {
    if (contactData.id === 0) {
      // Add Contact Functionality
      _addContact(contactData);
      _contactsArrAdd(contactData);
    } else {
      // Edit Contact Functionality
      _editContact(contactData);
      _contactsArrEdit(contactData, currContactIndex);
    }
    _checkContactsList();
    reset.contactForm();
  } else {
    errorList.innerHTML = '';
    // Write Error(s) for Inputs Validity Checks
    if (!contactData.firstName || !_isNameValid(contactData.firstName)) {
      _writeError('Please enter a valid first name. Do not include whitespace, special, and non-word characters.');
      contactForm.firstName.classList.add('error');
    } else {
      contactForm.firstName.classList.remove('error');
    }
    if (!contactData.lastName || !_isNameValid(contactData.lastName)) {
      _writeError('Please enter a valid last name. Do not include whitespace, special, and non-word characters.');
      contactForm.lastName.classList.add('error');
    } else {
      contactForm.lastName.classList.remove('error');
    }
    if (!contactData.phone || !_isPhoneValid(contactData.phone)) {
      _writeError('Please enter a valid phone number. Acceptable Formats: 01-2345678 (Landline) or 08102345678 (Mobile).');
      contactForm.phone.classList.add('error');
    } else {
      contactForm.phone.classList.remove('error');
    }
    if (!contactData.email) {
      _writeError('Please enter a valid email address.');
      contactForm.email.classList.add('error');
    } else {
      contactForm.email.classList.remove('error');
    }
    if (contactForm.image.files.length) {
      if (!contactForm.image.files[0].type.startsWith('image/')) {
        _writeError('Please select a valid image file type');
      }
    }
    view.contactForm();
    window.scrollTo({
      top: document.querySelector('.app-user-contacts').offsetTop,
      behavior: 'smooth'
    })
  }
}

/* 
Contact Image Preview Area Initialization
----------------------------------------------------------------- */
// Format Contact Image Size Nicely
function _formatImageSize(fileSize) {
  if (fileSize < 1024) {
    return fileSize + 'bytes';
  } else if (fileSize > 1024 && fileSize < 1048576) {
    return (fileSize / 1024).toFixed(1) + 'KB';
  } else if (fileSize > 1048576) {
    return (fileSize / 1048576).toFixed(1) + 'MB';
  }
}

// Update Contact Image Preview Area
const imageInput = contactForm.image;
function _previewImage() {
  const selectFile     = imageInput.files[0];
  previewDiv.innerHTML = '';
  if (imageInput.files.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No image file has been selected';
    previewDiv.appendChild(para);
  } else {
    const imgThumbnailDiv = document.createElement('div');
    imgThumbnailDiv.classList.add('img-thumbnail');
    const imgThumbnail = document.createElement('img');

    const imgInfo = document.createElement('div');
    imgInfo.classList.add('img-info');
    const imgName = document.createElement('p');
    imgName.classList.add('img-name');

    const imgSize = document.createElement('p');
    imgSize.classList.add('img-size');

    if (_isImageValid(selectFile.type)) {
      window.URL = window.URL || window.webkitURL;
      imgThumbnail.src = window.URL.createObjectURL(selectFile);
      imgThumbnailDiv.appendChild(imgThumbnail);

      imgName.textContent = `File Name: ${selectFile.name}`;
      imgSize.textContent = `File Size: ${_formatImageSize(selectFile.size)}`;

      imgInfo.appendChild(imgName);
      imgInfo.appendChild(imgSize);
    } else {
      const filesArr = Array.from(imageInput.files);
      const para = document.createElement('p');
      para.textContent = `\"${selectFile.name}\" is not a valid file type. Select one of the following file type: jpeg, jpg, or png.`;
      para.style.color = '#dd2c00';
      para.style.letterSpacing = '0.50px';
      previewDiv.appendChild(para);
      
      // Remove Invalid File Earlier Selected
      filesArr.splice(0, 1);
    }
    previewDiv.appendChild(imgThumbnailDiv);
    previewDiv.appendChild(imgInfo);
  }
}

// Attach Change Event Listener to Contact Image Field Input
imageInput.addEventListener('change', _previewImage);

/* 
Contact Addition Functionality
----------------------------------------------------------------- */
// 'contactIndex' Holds Unique Identifier for Each Contact
let contactIndex = 1;

// Display Contact on App Landing Page
function _addContact(obj) {
  obj.id = contactIndex;

  const contact = document.createElement('li');
  contact.classList.add('contact');
  contact.setAttribute('id', `contact-${obj.id}`);
  contact.setAttribute('data-id', String(obj.id));

  const imgThumbnailDiv = document.createElement('div');
  imgThumbnailDiv.classList.add('img-thumbnail');
  const imgThumbnail = document.createElement('img');
  imgThumbnail.src = obj.image;
  imgThumbnail.setAttribute('data-id', String(obj.id));
  imgThumbnail.setAttribute('alt', `Potrait of ${obj.firstName} ${obj.lastName}`);
  imgThumbnail.setAttribute('title', `${obj.firstName} ${obj.lastName}`);
  imgThumbnailDiv.appendChild(imgThumbnail);

  const nameplateDiv = document.createElement('div');
  nameplateDiv.classList.add('nameplate');
  const nameplate = document.createElement('p');
  nameplate.setAttribute('data-id', String(obj.id));
  nameplate.textContent = `${obj.firstName} ${obj.lastName}`;
  nameplateDiv.appendChild(nameplate);

  contact.appendChild(imgThumbnailDiv);
  contact.appendChild(nameplateDiv);
  contactList.appendChild(contact);

  // Increase 'contactIndex' to Hold Next Contact Unique ID
  contactIndex++;
}

// Add Every New Contact Profile to an Array (contactsArr)
let contactsArr = [];
function _contactsArrAdd(contactData) {contactsArr.push(contactData)}

// Contact Form's Submit Event Listener to Add & Display Contact
contactForm.addEventListener('submit', _contactFormInit);

/* 
Contact Details Display Functionality
------------------------------------------------------------------- */
// Toggles View to Landing Page with Contact Details 'Close' Button
const cDetailCloseBtn = document.querySelector('#cdetails-close-btn');
cDetailCloseBtn.addEventListener('click', () => {
  reset.contactDetails();
  view.landingPage();
});

// Contact Details Initialization
let currContact = {};
let currContactIndex;
function _contactDetailsInit(event) {
  let clickedContactId = parseInt(event.target.getAttribute('data-id'));
  for (let i = 0; i < contactsArr.length; i++) {
    if (clickedContactId === contactsArr[i].id) {
      contactImage.src = contactsArr[i].image;
      contactName.textContent = `${contactsArr[i].firstName} ${contactsArr[i].lastName}`;
      contactPhone.textContent = contactsArr[i].phone;
      contactEmail.textContent = contactsArr[i].email;

      contactImage.src.alt = `A potrait of ${contactsArr[i].firstName} ${contactsArr[i].lastName}`;
      contactImage.src.alt = `${contactsArr[i].firstName} ${contactsArr[i].lastName}`;

      currContact = contactsArr[i];
      currContactIndex = i;
    }
  }
  view.contactDetails();
}

// Contact's Click Event to Display the Contact's Details
contactList.addEventListener('click', _contactDetailsInit, true);

/* 
Contact Editing Functionality
------------------------------------------------------------------- */
// Populate Contact Form for Editing
const editContactButton = document.querySelector('.edit-contact');
function _updateContact() {
  contactForm.contactId.value = currContact.id;
  contactForm.firstName.value = currContact.firstName;
  contactForm.lastName.value  = currContact.lastName;
  contactForm.phone.value     = currContact.phone;
  contactForm.email.value     = currContact.email;
  reset.contactDetails();
  view.contactForm();
}

// EditButton Click Event to Display Contact's Details on Contact Form
editContactButton.addEventListener('click', _updateContact);

// Contact Editing Functionality
function _editContact(obj) {
  const contact = document.querySelector(`#contact-${obj.id}`);
  contact.innerHTML = '';

  const imgThumbnailDiv = document.createElement('div');
  imgThumbnailDiv.classList.add('img-thumbnail');
  const imgThumbnail = document.createElement('img');
  imgThumbnail.src = obj.image;
  imgThumbnail.setAttribute('data-id', String(obj.id));
  imgThumbnail.setAttribute('alt', `A potrait of ${obj.firstName} ${obj.lastName}`);
  imgThumbnail.setAttribute('title', `${obj.firstName} ${obj.lastName}`);
  imgThumbnailDiv.appendChild(imgThumbnail);

  const nameplateDiv = document.createElement('div');
  nameplateDiv.classList.add('nameplate');
  const nameplate = document.createElement('p');
  nameplate.setAttribute('data-id', String(obj.id));
  nameplate.textContent = `${obj.firstName} ${obj.lastName}`;
  nameplateDiv.appendChild(nameplate);

  contact.appendChild(imgThumbnailDiv);
  contact.appendChild(nameplateDiv);
  contactList.appendChild(contact);
}

// Replace Old Contact Data in contactsArr with a New One
function _contactsArrEdit(obj, currContactIndex) {
  contactsArr.splice(currContactIndex, 1, obj);
  console.table(contactsArr);
}

/* 
Contact Delete Functionality
------------------------------------------------------------------- */
const delContactButton = document.querySelector('.del-contact');

// Remove Contact from the DOM
function _delContact(currContact) {
  const selectContact = document.querySelector(`#contact-${currContact.id}`);
  selectContact.remove(this.firstChild);
}

// Delete Contact Data from the Contacts Array List
function _contactsArrDel(currContactIndex) {
  contactsArr.splice(currContactIndex, 1);
  console.table(contactsArr);
}

// Contact Delete Initialization
function _contactDelInit() {
  const delContactWarning = window.confirm(`Do you want to remove \"${currContact.firstName} ${currContact.lastName}\" from your Contacts\' List?`);
  if (delContactWarning) {
    _delContact(currContact);
    _contactsArrDel(currContactIndex);
   reset.contactDetails();
    _checkContactsList();
    view.landingPage();
  } else {
    return;
  }
  _checkContactsList();
}

delContactButton.addEventListener('click', _contactDelInit);

// On First Run
view.landingPage();