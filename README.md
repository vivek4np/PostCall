# PostCall
The scenario is 
I have a function apiCall() which makes GET request when my web page loads it makes multiple GET requests like . 

GET   
0ms -- apiCall(lookup/customer/2);   
100ms -- apiCall(lookup/user/1);   
110ms --- apiCall(lookup/customer/3);   
120ms --- apiCall(lookup/user/2);     

but what I want to do is instead of making these multiple GET requests inside apiCall() I want to make a single POST request inside the apiCall function after each second which will collect the data from the url for one second and creates its own body like this for the post request

POST    
1000ms   
lookup    
body: { user: [1,2], cusomter[2,3]}      

apiCall() should return a promise so that it can access the response from the request.
