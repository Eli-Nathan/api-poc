module.exports = (collection, title) => {
  const sanitizedCollectionType = collection.replace("-", " ");
  return {
    subject: `Rejected ${sanitizedCollectionType}`,
    text: `
Unfortunately, your ${sanitizedCollectionType} for ${title} was rejected.

This could be for a number of reasons such as inaccurate information, or information we simply couldn't verify.
	  
Please reply to this email if you'd like to discuss further. Thanks!

-- 

wildway Team.	
`,
    html: `
<h2>Rejected ${sanitizedCollectionType}</h2>

<p>Unfortunately, your ${sanitizedCollectionType} for ${title} was rejected.</p>

<p>This could be for a number of reasons such as inaccurate information, or information we simply couldn't verify.</p>
		  
<p>Please reply to this email if you'd like to discuss further. Thanks!</p>      
	
<p>--</p> 
	
<p>wildway Team.</p>
`,
  };
};
