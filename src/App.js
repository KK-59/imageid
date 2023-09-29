import React from 'react';
import { useState, useEffect, useRef } from 'react';  
import * as mobilenet from "@tensorflow-models/mobilenet"; 


function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const imageRef = useRef()

  const loadModel = async() => {
    setIsModelLoading(true)
    try {
        const model = await mobilenet.load()
        setModel(model)
        setIsModelLoading(false)
    } catch(error) {
        console.log(error)
        setIsModelLoading(false)
    }
  } 

  const uploadImage = (e) => {
      const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  const identify = async() => {
    const results = await model.classify(imageRef.current) 
    // the line above calls the tensorflow model and tells it to classify the image that we saved in 'imageRef' and save teh classification in a const called 'results'
    setResults(results)
  }

  useEffect(() => {
    loadModel()
  }, [])

  if (isModelLoading) {
    return (
      <div class="loadingScreen">
        <h1>Loading model!</h1>
        <div class="loader"></div>
      </div>
      
    )
  }
  
  console.log(results)

  return (
    <div className="App">
      <h1 className='header'> Image Identification</h1>

      <h2>Upload Image</h2>
      <div className='inputHolder'>
        <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} />
      </div>
      <div className='mainWrapper'>
        <div className='mainContent'>
          <div className='imageHolder'>
            {imageURL && <img src={imageURL} alt="uploadPreview" crossOrigin="anonymous" ref={imageRef}/>}
          </div>
          {results.length > 0 && <div className='resultsHolder'>
            {results.map((results,index) => {
              return (
                <div className='result'>
                    {index === 0 && <span className='name'> {results.className}</span>}
                    <br/>
                    {index === 0 && <span className='confidence'> Confidence level: {(results.probability * 100).toFixed(2)}% </span>}
                </div>
              )
            })}
          </div>
          }
        </div>
        {imageURL && <button className='button' onClick={identify}>Identify Image</button>}
      </div>


      <h2>About the project</h2>
      <br/>
      <div className='text'>Dengue is the most common mosquito borne disease, with 3.9 billion people, about half the world's population, at risk of contracting it (<a href="https://www.who.int/news-room/fact-sheets/detail/vector-borne-diseases#:~:text=Dengue%20is%20the%20most%20prevalent,estimated%2040%2C000%20deaths%20every%20year.">WHO</a>). It is most common in tropical and urban areas making Singapore, where we are based, a prime location for the disease (<a href="https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue#:~:text=Dengue%20is%20a%20viral%20infection,million%20infections%20occurring%20each%20year.">WHO</a>). 
      Similarly, Malaria, the Zika virus, Chikungunya, and other such diseases, are a pressing problem, exacerbated by climate change (<a href="https://www.cnn.com/2022/06/06/asia/health-dengue-singapore-emergency-climate-heat-intl-hnk/index.html">CNN</a>), with the WHO citing it as a global health problem, particularly in Asia (<a href="http://www.who.int/en/news-room/fact-sheets/detail/dengue-and-severe-dengue">WHO</a>). To make matters worse, treatment for such diseases are usually quite expensive (<a href="https://www.sciencedirect.com/science/article/pii/S1201971219300979">Panmei, et al.</a>). In these cases, <b>prevention is better than cure.</b>
      <br/>
      Differentiating between dangerous mosquitoes, that carry such diseases, from regular ones is the key to mitigating this problem at a low cost: after identifying a dangerous mosquito, families can protect high-risk individuals (babies, the elderly, the sick, etc.) and simply use insecticide to kill the mosquito. Then, they can raise the alarm and look for eggs/other mosquitos in the home. However, differentiating these mosquitos is impossible. This is where our solution comes in -- our app allows users to take a picture of a mosquito and, using our AI model, trained on --number-- of data, can identify whether or not it is dangerous. <b>This is an easy, cheap way to mitigate a rampant problem. </b>
      <br/>
      In the future, we would like to expand the reach of this app -- we would like to set up cameras in hospitals, convention centres, etc., which automatically scan for mosquitos and notify staff if a dangerous one is found. We also want to contact hospitals to obtain more data (more than what is currently publicly available) to fine-tune our model even more. 

      hello
      </div>
      
    </div>
  );
}

export default App;
