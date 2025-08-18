import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

 const options = {
  method:'GET',

  params: {
    maxResults: 100,
  },
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  },
};

export const fetchFromAPI = async (url: string) => {
  try{
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    console.log(data)
    return data;
  }
  catch (error){
    alert(error)
  }
};
