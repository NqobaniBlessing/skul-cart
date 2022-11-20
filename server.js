//importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');

//aws and dotenv config
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

//aws parameters
const region = process.env.REGION;
const bucketName = process.env.BUCKETNAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

//init s3
const s3 = new aws.S3();

//generate image upload link
async function generateUrl() {
  let date = new Date();
  let id = parseInt(Math.random() * 10000000000);

  const imageName = `${id}${date.getTime()}.jpg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 300, //300ms
    ContentType: 'image/jpeg, image/png, image/webp, image/avif, image/gif',
  };

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  return uploadUrl;
}

//firebase admin setup
let serviceAccount = require('./skul-cart-ecommerce-firebase-adminsdk-ximtp-d70b8e6b70.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

//declare static path
let staticPath = path.join(__dirname, 'public');

//initializing express.js
const app = express();

//middlewares
app.use(express.static(staticPath));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//routes
//home route
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

//signup route
app.get('/signup', (req, res) => {
  res.sendFile(path.join(staticPath, 'signup.html'));
});

app.post('/signup', (req, res) => {
  let { name, number, email, password, tac, notifications } = req.body;

  //form validation
  if (name.length < 2) {
    return res.json({ alert: 'Name must be at least two letters long' });
  } else if (!number.length) {
    return res.json({ alert: 'Enter your phone number' });
  } else if (!email.length) {
    return res.json({ alert: 'Enter your email address' });
  } else if (password.length < 8) {
    return res.json({ alert: 'Password should be at least 8 characters long' });
  } else if (!Number(number) || number.length < 10) {
    return res.json({ alert: 'Enter a valid phone number' });
  } else if (!tac) {
    return res.json({ alert: 'You must agree to our terms and conditions' });
  }

  //store user in db
  db.collection('users')
    .doc(email)
    .get()
    .then(user => {
      if (user.exists) {
        return res.json({ alert: 'E-mail already exists in the system' });
      } else {
        //encrypt password before storing it
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash;
            db.collection('users')
              .doc(email)
              .set(req.body)
              .then(data => {
                res.json({
                  name: req.body.name,
                  email: req.body.email,
                  seller: req.body.seller,
                });
              });
          });
        });
      }
    });

  //res.json("data received");
});

//login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(staticPath, 'login.html'));
});

app.post('/login', (req, res) => {
  let { email, password } = req.body;

  if (!email.length || !password.length) {
    return res.json({ alert: 'Fill all the inputs' });
  }

  db.collection('users')
    .doc(email)
    .get()
    .then(user => {
      if (!user.exists) {
        //if email does not exist
        return res.json({ alert: 'E-mail does not exist in the system' });
      } else {
        bcrypt.compare(password, user.data().password, (err, result) => {
          if (result) {
            let data = user.data();
            return res.json({
              name: data.name,
              email: data.email,
              seller: data.seller,
            });
          } else {
            return res.json({ alert: 'Your password is incorrect' });
          }
        });
      }
    });
});

//seller route
app.get('/seller', (req, res) => {
  res.sendFile(path.join(staticPath, 'seller.html'));
});

app.post('/seller', (req, res) => {
  let { name, about, address, number, tac, legit, email } = req.body;
  if (
    !name.length ||
    !address.length ||
    !about.length ||
    number.length < 10 ||
    !Number(number)
  ) {
    return res.json({ alert: 'Some information is not correct' });
  } else if (!tac || !legit) {
    return res.json({
      alert: 'You must confirm that your information is legitimate',
    });
  } else {
    //update user's seller status here
    db.collection('sellers')
      .doc(email)
      .set(req.body)
      .then(data => {
        db.collection('users')
          .doc(email)
          .update({
            seller: true,
          })
          .then(data => {
            return res.json(true);
          });
      });
  }
});

//add product route
app.get('/add-product', (req, res) => {
  res.sendFile(path.join(staticPath, 'addProduct.html'));
});

app.get('/add-product/:id', (req, res) => {
  res.sendFile(path.join(staticPath, 'addProduct.html'));
});

//get the upload link
app.get('/s3url', (req, res) => {
  generateUrl().then(url => res.json(url));
});

//add product
app.post('/add-product', (req, res) => {
  let {
    name,
    shortDescription,
    description,
    images,
    actualPrice,
    discount,
    sellPrice,
    stock,
    tags,
    tac,
    email,
    draft,
    id,
  } = req.body;

  //validation
  if (!name.length) {
    return res.json({ alert: 'Enter product name' });
  } else if (shortDescription.length > 100 || shortDescription.length < 10) {
    return res.json({
      alert: 'Short description must be between 10 and 100 letters long',
    });
  } else if (!description.length) {
    return res.json({ alert: 'Enter detailed description about the product' });
  } else if (!images.length) {
    //image link array
    return res.json({ alert: 'Upload at least one product image' });
  } else if (!actualPrice.length || !discount.length || !sellPrice.length) {
    return res.json({ alert: 'You must add the pricing' });
  } else if (stock < 20) {
    return res.json({ alert: 'You should have at least 20 items in stock' });
  } else if (!tags.length) {
    return res.json({
      alert: 'Enter a few tags to help with ranking your product in search',
    });
  } else if (!tac) {
    return res.json({ alert: 'You must agree to our terms and conditions' });
  }

  //add product
  let docName =
    id == undefined
      ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}`
      : id;
  db.collection('products')
    .doc(docName)
    .set(req.body)
    .then(_data => {
      res.json({ product: name });
    })
    .catch(_err => {
      return res.json({ alert: 'Some error occurred, please try again' });
    });
});

//Admin dashboard route
app.get('/admin-dash', (req, res) => {
  res.sendFile(path.join(staticPath, 'admin-dash.html'));
});

//get products
app.post('/get-products', (req, res) => {
  let { email, id, tag } = req.body;

  let docRef;

  if (id) {
    docRef = db.collection('products').doc(id);
  } else if (tag) {
    docRef = db.collection('products').where('tags', 'array-contains', tag);
  } else {
    docRef = db.collection('products').where('email', '==', email);
  }

  docRef.get().then(products => {
    if (products.empty) {
      return res.json('No Products');
    }
    let productArr = [];
    if (id) {
      return res.json(products.data());
    } else {
      products.forEach(item => {
        let data = item.data();
        data.id = item.id;
        productArr.push(data);
      });
      res.json(productArr);
    }
  });
});

//delete product
app.post('/delete-product', (req, res) => {
  let { id } = req.body;
  db.collection('products')
    .doc(id)
    .delete()
    .then(data => {
      res.json('Success');
    })
    .catch(err => {
      res.json('Error');
    });
});

//get orders
app.get('/get-orders', (req, res) => {
  const docRef = db.collection('order');

  docRef.get().then(orders => {
    let orderArr = [];
    orders.forEach(item => {
      let data = item.data();
      data.id = item.id;
      orderArr.push(data);
    });
    res.send(orderArr);
  });
});

//product page
app.get('/products/:id', (req, res) => {
  res.sendFile(path.join(staticPath, 'product.html'));
});

app.get('/search/:key', (req, res) => {
  res.sendFile(path.join(staticPath, 'search.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(staticPath, 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(staticPath, 'checkout.html'));
});

app.get('/makePayment', (req, res) => {
  res.sendFile(path.join(staticPath, 'makePayment.html'));
});

app.post('/order', (req, res) => {
  const { name, order, email, address } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: `${process.env.PASSWORD}#`,
    },
  });

  const mailOption = {
    from: process.env.EMAIL,
    to: email.toString(),
    subject: 'Skul-Cart: Order Placed',
    html: `
      <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>

      <style>
        body {
          min-height: 90vh;
          background: #f5f5f5;
          font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
            'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .heading {
          text-align: center;
          font-size: 40px;
          width: 50%;
          display: block;
          line-height: 50px;
          margin: 30px auto 60px;
        }

        .heading span {
          font-weight: 300;
        }

        .btn {
          width: 200px;
          height: 50px;
          border-radius: 5px;
          background: #df7206;
          color: #fff;
          display: block;
          margin: auto;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="">
        <h1 class="heading">
          Dear ${name}, <span>your order has been successfully placed, it will be delivered to the address you input on checkout.</span>
        </h1>
        <button class="btn">Check Status</button>
      </div>
    </body>
  </html>
      `,
  };

  let docName = email + Math.floor(Math.random() * 123719287419824);
  db.collection('order')
    .doc(docName)
    .set(req.body)
    .then(data => {
      transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          res.json({
            alert:
              'Oops! It looks like something went wrong. Please try again...' +
              err,
          });
        } else {
          res.json({ alert: 'Your order has been successfully placed' });
        }
      });
    });
});

//Mail route
app.get('/mail', (req, res) => {
  res.sendFile(path.join(staticPath, 'mail.html'));
});

//404 route
app.get('/404', (req, res) => {
  res.sendFile(path.join(staticPath, '404.html'));
});

app.use((req, res) => {
  res.redirect('/404');
});

app.listen(3000, () => {
  console.log('listening on port 3000.......');
});
