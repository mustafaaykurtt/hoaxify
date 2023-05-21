# Hoaxify
Social Media App

For the promotional video; 
https://youtu.be/WprO8ytoY74


I used layered architecture in my project. These layers;
* Business Layer
* Presentation Layer
* Entitiy Layer
* Data access Layer

<H3>Technologies</H3>
<b>Backend</b></br>
Java Core
Spring Boot
Spring Security
Spring Data
Jakarta EE
Lombok
Junit5 (Test)
Mockito (Test)
Integration Test (Test)
Apache Tika
Spring Developer Tools	
H2-Database Engine
Rest API

<b>Frontend</b></br>
React Js
React Router
Axios
Redux Toolkit
Boostrap
React-i18next (for language exchanges)
Secure-ls
Timeago.js (For time information in posts)
HTML
CSS
Material UI
Postman

React DevTools
Redux DevTools

<b>Gains</b></br> 
- Using the annotation mechanism provided by Spring Framework, we created annotation classes to perform operations specific to our needs (@UniqueUsername, @CurrentUser etc.)
- In case of errors, dynamic messages were generated using a common Error class.
- Http methods such as Post, Get, Put, Delete were used.
- Global State management was done with Redux Toolkit. createSlice, createAction, createReducer, createAsyncThunk etc. functions were used.
- API requests were created using HTTP clients such as Axios. Necessary parameters and header information were added to the requests. When API responses were received, the data and error conditions in the response were processed. The data obtained was passed to the relevant components to be displayed in the user interface or saved in the Global State.
- During the project development period, One-to-Many, Many-to-One, Many-to-One, One-to-One relationships between entities such as user-hoax (posts), user-token were used through Jpa. In addition, the Cascade (Reaction) feature was used, so that the posts of a deleted user were also deleted.
- "Derived Queries" were used for database queries through Spring Data Jpa.
- In the project development process, the Basic Authentication method was first preferred to ensure security and manage authentication processes. Then, JWT (JSON Web Token) method was used. Finally, opaque tokens were used and these tokens were saved in the database associated with the user.
- I improved my ability to create dynamic and interactive web interfaces by building a component-based structure with React.
- Using the ApiProgress component and related Hooks, the status of API requests was tracked and progress information was provided to users. Thus, users could easily see when API requests were completed, which requests were still in progress, and the user experience was improved.



