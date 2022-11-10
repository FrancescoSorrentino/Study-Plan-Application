/**
 * All the API calls
 */

 const APIURL = new URL('http://localhost:3001/api/');  // Do not forget '/' at the end

 /*******************************************************************************/
 /************************************CORSI APIS*********************************/
 
 async function getAllCourses() {
    
    const response = await fetch(new URL('corsi', APIURL), {credentials: 'include'});
    const coursesJson = await response.json();
    if (response.ok) {
      return coursesJson //.map((co) => ({ codice: co.codice, name: co.name }));
    } else {
      throw coursesJson;  // an object with the error coming from the server
    }
  }

/*******************************************************************************/
/***************************PIANO DI STUDI APIS*********************************/

async function getPlan() {
  const response = await fetch(new URL('piano', APIURL), {credentials: 'include'});
    const plan = await response.json();
    if (response.ok) {
      return plan; 
    } else {
      throw plan;  // an object with the error coming from the server
    }
}

async function addPlan(type, courses) {
    let cor = courses.map((c) => c.codice )
    let response = await fetch(new URL('piano', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({type: type, courses: cor })
    });
    if(response.ok) {
      return
    }
    else{
      const errDetail = await response.json();
      throw errDetail.message;
    }
}

async function updatePlan(type, courses) {
  let cor = courses.map((c) => c.codice )
  let response = await fetch(new URL('piano', APIURL), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({type: type, courses: cor })
  });
  if(response.ok) {
    return
  }
  else{
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function deletePlan() {

  let response = await fetch(new URL('piano', APIURL), {
    method: 'DELETE',
    credentials: 'include',
  });
  if(response.ok) {
    return
  }
  else{
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

/*******************************************************************************/
/*******************************AUTENTICAZIONE APIS*****************************/

 async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: credentials.email, password: credentials.password}),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }

  async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
    const userInfo = await response.json();
    
    if (response.ok) {
      return userInfo
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

  /*******************************************************************************/
  /*******************************************************************************/

  const API = { logIn, logOut, getAllCourses, getUserInfo, addPlan, getPlan, updatePlan, deletePlan};
  export default API;