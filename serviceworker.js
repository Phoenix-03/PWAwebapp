self.addEventListener("install", function(event){
event.waitUntil(preLoad());
});

self.addEventListener("fetch", function(event){
  event.respondWith(checkResponse(event.request).catch(function(){
    console.log("Fetch from cache successful!");
     return returnFromCache(event.request); 
  }));
  console.log("Fetch successful!"); 
  event.waitUntil(addToCache(event.requesst));
});

self.addEventListener('sync', event=> {
  if (event.tag === 'syncMessage'){
    console.log("Sync successful!")
  }
});

self.addEventListener("push", function(event) {
  if (event && event.data) {
      try {
          var data = event.data.json();
          if (data && data.method === "pushMessage") {
              console.log("Push notification sent");
              self.registration.showNotification("Ecommerce website", { body: data.message });
          }
      } catch (error) {
          console.error("Error parsing push data:", error);
      }
  }
});
 
  var preLoad = function () {
  return   caches.open("ofﬂine").then(function   (cache)   {
  // caching index and important routes
  return cache.addAll(["/", "/index.html", "/about.html", "/blog.html", "/contact.html", "/services.html","/img/slider-img4.jpg", "/css/main.css"]);
  });
  };
  
  var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request)
            .then(function (response) {
                if (response.status !== 404) {
                    fulfill(response);
                } else {
                    reject(new Error("Response not found"));
                }
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

var returnFromCache = function(request){
	return caches.open("offline").then(function(cache){
		return cache.match(request).then(function(matching){
			if(!matching || matching.status == 404){
				return cache.match("offline.html");
			}
			else{
				return matching;
			}
		});
	});
};

var addToCache = function(request) {
    return caches.open("offline").then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response.clone()).then(function() {
                return response;
            });
        });
    });
};



// self.addEventListener("install", function (e) {
// e.waitUntil(
// 	caches.open(staticCacheName).then(function (cache) {
// 	return cache.addAll(["/", "/index.html", "/about.html", "/blog.html", "/contact.html", "/services.html","/img/slider-img4.jpg", "/css/main.css"]);
// 	})
// );
// });

// self.addEventListener("fetch", function (event) {
// console.log(event.request.url);

// event.respondWith(
// 	caches.match(event.request).then(function (response) {
// 	return response || fetch(event.request);
// 	})
// );
// });