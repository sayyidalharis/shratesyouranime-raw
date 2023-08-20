import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/trainedData.module.css';
import Head from 'next/head';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt  as halfStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function TrainedData() {
  const [trainedData, setTrainedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("");
  const [lastSortCriteria, setLastSortCriteria] = useState(null); // Keep track of last sorting criteria


  useEffect(() => {
    fetch('/api/trained-data')
      .then((response) => response.json())
      .then((data) => {
        setTrainedData(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setTrainedData([]); // Clear the data array
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>
      
      <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
      </div>
    </div>;
  }

  if (error) {
    return <div>No data available</div>; // Display "No data" instead of error
  }
  
  const sortFilteredData = (criteria, data) => {
    setLastSortCriteria(criteria);

    const sortedData = [...data]; // Create a copy of filteredData to sort

    if (criteria === 'attractive') {
      sortedData.sort((a, b) => b.attractiveness_rating - a.attractiveness_rating);
    } else if (criteria === 'leastattractive') {
      sortedData.sort((a, b) => a.attractiveness_rating - b.attractiveness_rating);
    } else if (criteria === 'comments') {
      sortedData.sort((a, b) => b.comment_count - a.comment_count);
    } else if (criteria === 'leastcomments') {
      sortedData.sort((a, b) => a.comment_count - b.comment_count);
    }
    else{
      // sort by id
      sortedData.sort((a, b) => a.id - b.id);
    }

    setFilteredData(sortedData);
    console.log(criteria, sortedData)
  };

  
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Filter characters based on search term
      console.log('searching', searchTerm)
      const filteredTrainedData = trainedData.filter((entry) => {
        return entry.name.toLowerCase().includes(searchTerm.toLowerCase());
      });

      console.log(filteredTrainedData)

      // Sort the filtered data based on the last sort criteria, don't sort if there's no criteria
      if (lastSortCriteria) {
        sortFilteredData(lastSortCriteria, filteredTrainedData);
      }
      else{
        setFilteredData(filteredTrainedData);
      }
    }
  };


  const generateStarRating = (rating) => {
    const stars = [];
    const solidCount = Math.floor(rating / 2); // Calculate the number of solid stars
    const hasHalfStar = rating - (solidCount * 2) >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < solidCount) {
        stars.push(<FontAwesomeIcon key={i} icon={solidStar} />);
      } else if (hasHalfStar && i === solidCount) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={regularStar} />);
      }
    }

    return stars;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Trained Data</title>
      </Head>
      <h1 className={styles.heading}>Trained Data</h1>

      <div className={styles.searchContainer}>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleSearchKeyPress}
        className={styles.inputStyle}
      />
      {/* button to submit input for second option other than pressing enter */}
      <button className={styles.inputButton} onClick={() => {
        const filteredTrainedData = trainedData.filter((entry) => {
          return entry.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
  
        console.log(filteredTrainedData)
  
        // Sort the filtered data based on the last sort criteria, don't sort if there's no criteria
        if (lastSortCriteria) {
          sortFilteredData(lastSortCriteria, filteredTrainedData);
        }
        else{
          setFilteredData(filteredTrainedData);
        }
      }}>Search</button>

      </div>

      <div className={styles.sortContainer}>
        <label className={styles.sortLabel}>Sort by :</label>
        <select
          className={styles.sortSelect}
          value={sortCriteria}
          onChange={(e) => {
            setSortCriteria(e.target.value);
            sortFilteredData(e.target.value, filteredData)
          }}
          aria-label="Sort by"
        >
          <option value="">Default</option>
          <option value="attractive">Most Attractive</option>
          <option value="leastattractive">Least Attractive</option>
          <option value="comments">Most Comments</option>
          <option value="leastcomments">Least Comments</option>
        </select>
        <div className={styles.randomStyle}>
          {/* button to pick random data out of filteredData*/}
          <button className={styles.randomButton} onClick={() => {
            let randA = Math.floor(Math.random() * trainedData.length);
            // get a randB that is not equal to randA
            let randB = Math.floor(Math.random() * trainedData.length);
            while(randB == randA){
              randB = Math.floor(Math.random() * trainedData.length);
            }
            setFilteredData([trainedData[randA], trainedData[randB]]);  
          }}></button>
        </div>
      </div>

      <div className={styles.dataContainer}>
        <div className={styles.dataGrid}>
        {/* check if there's error */}
        {trainedData['error'] == "Internal server error" || filteredData.length == 0 ? (
          <div>
            No data available
            {/* console log data */}
          </div>
          
        ) : (  
        filteredData.map((entry) => (
          <div key={entry.id} className={styles.dataEntry}>
          <Link 
          // link it to trained-data/[id] and share image_path, attractiveness_rating, and comment_count
          href={{
              pathname: `/trained-data/${entry.id}`,
              query: {
                  image_path: entry.image_path,
                  attractiveness_rating: entry.attractiveness_rating,
                  comment_count: entry.comment_count,
                  charaname: entry.name
              },
          }}
          // hide the query from the url
          as={`/trained-data/${entry.id}`}
          >
            <div className={styles.dataEntryOverlay}>
              <div className={styles.pictureContainer}>
                  <div className={styles.pictureOverlay}>
                    <img src={entry.image_path} alt={`Anime ${entry.id}`} />
                  </div>
              </div>
              <div className={styles.dataInfo}>
                <div className={styles.dataInfoOverlay}>
                  <h1 className={styles.heroTitle}>{entry.name}</h1>
                  <div className={styles.starRating}>{generateStarRating(entry.attractiveness_rating)}</div>
                  <p>Score : {entry.attractiveness_rating}/10</p>
                  <p>{entry.comment_count !== null ? entry.comment_count : 0} comments</p>
                </div>
              </div>
            </div>
          </Link>
          </div>
        ))
        )}
      </div>
        
      </div>
    </div>
  );
}
