import { config } from '../../lib/sanity'
const sanity = require('@sanity/client')

const client = sanity(config)

export default async function handler(req, res) {
    const { _id,firstname,lastname, dob, gender } = JSON.parse(
      req.body
    );
    console.log(req.body);
const data = await client
  .patch(_id) // Document ID to patch
    .set({ 
      firstname: firstname,
      lastname: lastname,
      dob: dob,
      gender: gender
        
        }) // Shallow merge
  .commit() // Perform the patch and return a promise
  .catch((err) => {
      console.error('Oh no, the update failed: ', err.message)
      res.status(500)
  })
    console.log(data)

    res.status(200).send('that worked!!')
}