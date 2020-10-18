export default class Requests {

    static fetch(method, url, params) {

        var promise = new Promise((resolve, reject) => {
            
            var xhr = new XMLHttpRequest

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status > 0) { // xhr.status == 0 => Request aborted, no internet or no server
                    
                    try {
                        if (xhr.status == 401) {
                            reject("Unauthorized");
                        }
                        resolve(JSON.parse(xhr.responseText))
                    } catch (error) {
                        reject("Error");
                    }

                }
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 0){
                    reject("No internet or request failed")
                }

            }

            if (method == "POST") {
                xhr.open(method, url, true)
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.send(JSON.stringify(params))
            } else if (method == "GET") {
                // append all params to url
                url += "?"
                for (var key in params) {
                    url += encodeURI(key) + "=" + encodeURI(params[key]) + "&";
                }
                xhr.open(method, url, true)
                xhr.send()
            } else {
                reject("Method " + method + " not supported");
            }

        });

        return promise;

    }
}
