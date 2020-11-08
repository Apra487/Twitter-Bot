const Twitter = require('twitter');
const Sheet = require('./sheet');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.OWNER_EMAI,
      pass: OWNER_EMAIL_PASSWORD
    }
  });

const mailOptions = {
    from: process.env.OWNER_EMAIL,
    to: process.env.RECIEVER_EMAIL,
    subject: '',
    text: '',
    html: ''
  };



(async function() {
    
    // TODO: connect to twitter via api
    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY, 
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET, 
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY, 
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET, 
      });
    while (true) {
      
          // TODO: pull next tweet from SpreadSheet
          const sheet = new Sheet();
          await sheet.load();
          const quotes = await sheet.getRows();
          // console.log(quotes);

          // ? Checking for available data
          if(!quotes[0]){
          
              // TODO Sending e-mail to the owner
              mailOptions.subject = 'Quotes Not Available(Google Sheet is empty)';
              mailOptions.text = 'Please upload new socrates quotes.';
              mailOptions.html = '<h1>Google Sheet is EMPTY!!!</h1><h2>Please upload new socrates quotes here.👇</h2><a href="https://docs.google.com/spreadsheets/d/1lq-XsGf7qEz_babKGbdD6vKO3t0GA4ODYSE_aGz1eZY/edit#gid=0" class="myButton">Google Sheet</a><style>.myButton {background-color:#44c767;border-radius:28px;border:1px solid #18ab29;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:17px;padding:16px 31px;text-decoration:none;text-shadow:0px 1px 0px #2f6627;}.myButton:hover {background-color:#5cbf2a;}.myButton:active {position:relative;top:1px;}</style><H3>OR</H3><P>https://docs.google.com/spreadsheets/d/1lq-XsGf7qEz_babKGbdD6vKO3t0GA4ODYSE_aGz1eZY/edit#gid=0</P>';
          

              transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
              });  

            
              // * Searching and Retweeting
              try{
                  let q = ['napoleon', 'napoleon quotes']; 'socrates', 'socrates quotes', 'socrates inspiration', 'quotes'
                  q.forEach(e => {
                      client.get('search/tweets', {q: e,lang: 'en',count:	50,result_type: 'mixed'}, function( error, tweets) {
                          if(!error){
                              tweets.statuses.forEach(i => {
                                  client.post('statuses/retweet/' + i.id_str , function(error, tweet) {
                                      console.log(tweet);
                                      if (error) console.log(error);
                                  });
                              })
                            }
                          });
                  });
                  return 1;
              }catch (error) {
                 console.log(error);
                 return 3;
              }
              
             
          } else {
            
                 // TODO: Send tweet
                 if (quotes[0].quote.length <= 280) {
                   
                  const status =  quotes[0].quote;
                
                      // * {status} = {status: status}
                      (async function (){
                          try {
                              await client.post('statuses/update', {status});
                              await console.log('Tweeted', status);
                              // TODO: remove quote from SpreadSheet
                              await quotes[0].delete();
                          }catch(e){
                              console.log(e);
                              // TODO Sending e-mail to the owner
                              mailOptions.subject='Quote BOT IS NOT WORKING!!!😔';
                              mailOptions.text=`Somthing went wrong.\nError message: ${e[0].message}\nError code: ${e[0].code}`;
                              transporter.sendMail(mailOptions, function(error, info){
                                  if (error) {
                                    console.log(error);
                                  } else {
                                    console.log('Email sent: ' + info.response);
                                  }
                              });
                            return 4;          
                          }
                      })()
                    return 2;  
                
                // A small experiment for updating profile name
                
                //  client.get('users/profile_banner', {screen_name	: 'test_socrates'}, function(error,tweet){
                //   if (!error) {
                //     console.log(tweet);
                //   } else{
                //     console.log(error);
                //   }
                // })
               
                // let total = 0;
                // function profile() {
                  
                //   await client.post('statuses/update', {status:'my name will update every minute based on the number of likes this tweet gets'});
                //   client.get('statuses/show/',{id: '1314583285058531330'}, function(e,t){
                //     if (!e) {
                //       console.log(t.favorite_count);
                //       if (total !== t.favorite_count) {
                //         total = t.favorite_count;
                //         client.post('account/update_profile', {name: `Socrates Quote Bot-this tweet has ${total} likes`}, function(error,tweet){
                //           if (!error) {
                //             console.log(tweet);
                //           } else {
                //             console.log(error);
                //           }
                //         })

                //       } else {

                //       }
                      
                //     } else {
                //       console.log(e);
                //     }
                //   })
                // }
                
                // setInterval(profile, 60000);
                
              } else {
                  // TODO: remove quote from SpreadSheet
                  await quotes[0].delete();
                  console.log("More than 280 words!!");
              }


          }
    }
    
      

})()

// Discover tech

/*
(async function() {
  // TODO: connect to twitter via api
    const client = new Twitter({
        consumer_key: ,
        consumer_secret:  ,
        access_token_key:     ,      
        access_token_secret: , 
      });
      function like(i){
        // console.log(tweets.statuses);
        client.post('favorites/create' ,{id: i.id_str} , function(error, response) {
            console.log(response);
            if (!error) { illestPrecha
                
                let username = response.user.screen_name;
                let tweetId = response.id_str;
                console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`);
                // console.log({x});
            }else{
              console.log(error);
            }
            
        });
      }

      function read (e){
        client.get('search/tweets', {q: e, count: 30,result_type: 'recent'}, function( error, tweets) {
          console.log(e);
            if(!error){

                   tweets.statuses.forEach(i =>{
                    client.post('favorites/create' ,{id: i.id_str} , function(error, response) {
                      console.log(response);
                      if (!error) {
                          
                          let username = response.user.screen_name;
                          let tweetId = response.id_str;
                          console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`);
                          // console.log({x});
                      }else{
                        console.log(error);
                      }
                      
                  });
                  })
                   tweets.statuses.forEach(i => {
                     client.post('statuses/retweet/' + i.id_str , function(error, tweet) {
                         console.log('hi');
                         console.log(tweet);
                         if (error) console.log(error);
                     });
                } )
                let x = 0, y = 0;
                // for (let i = 0; i <= tweets.statuses.length; i++) {
                //   var b = setTimeout(like, i*30000,tweets.statuses[i]);
                //   y++;
                // }
                
                clearTimeout(b);
                // client.get('favorites/list', function(error, tweets, response) {
                //   if(error) throw error;
                //   console.log(tweets);  // The favorites.
                //   console.log(response);  // Raw response object.
                // });
                
             
              console.log({y})
              }else{
                console.log(error);
              }
       })
      }
     
  // * Searching and Retweeting
  try{
    
        let q = ['#100DaysOfCode','#iosdev' ,'#unity3d', '#indiedev',  '#opensource', '#MachineLearning', 'javascript', '#algorithms'];
        // let q = [ '#Xcode', '#100DaysOfCode', '#Hacktoberfest'];
        for (let i = 0; i <= q.length; i++) {
          var b = setTimeout(read, i*20000,q[i]);
          
        }
       
        clearTimeout(b);
        
       
        // client.get('favorites/list', function(error, tweets, response) {
        //   if(error) throw error;
        //   console.log(tweets);  // The favorites.
        //   console.log(response);  // Raw response object.
        // });
    }catch (error) {
       console.log(error);
    }   
  })()
*/
