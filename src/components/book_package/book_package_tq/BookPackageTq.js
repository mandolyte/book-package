import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


import {fetchBookPackageTq} from './helpers';
import * as cav from '../../../core/chaptersAndVerses';

function validateInputProperties(bookId,chapters) {
  //console.log("validate bookId",bookId,", chapters:",chapters);
  if ( chapters === "" ) {
    let ref = {bookId: bookId, chapter: 1, verse: 1};
    //console.log("validate ref", ref);
    return cav.validateReference(ref);
  }
  const chaparray = chapters.split(",");
  for (var vip = 0; vip < chaparray.length; vip++ ) {
    let isValid = cav.validateReference(
      {bookId: bookId, chapter: chaparray[vip], verse: 1}
    );
    if ( isValid ) continue;
    return false
  }
  return true;
}

function BookPackageTq({
  bookId,
  chapter,
  classes,
  style,
}) 
{

  const [_tq, setVal] = useState("Waiting");
  useEffect( () => {
    const result = validateInputProperties(bookId, chapter);
    let chlist = chapter ? chapter : "(ALL)";
    if ( ! result ) {
      setVal(
        <Paper className={classes.paper} >
          <Typography variant="h5" gutterBottom>
            Invalid Book "{bookId.toUpperCase()}" 
            or Chapter(s) {chlist}
          </Typography> 
        </Paper>
      );
      return;
    }
    const fetchData = async () => {
      const result = await fetchBookPackageTq(
        {username: 'unfoldingword', languageId:'en', 
        bookId: bookId, chapters: chapter}
      );
      setVal(
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Translation Questions for "{bookId.toUpperCase()}" 
            and Chapters {chlist}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total Number of Questions: {result.l1count}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Distinct Number of Words {result.distinct}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total Number of Words {result.total}
          </Typography>
        </Paper>
      );  
    };
    fetchData();
  }, []); 
  // the parameter [] allows the effect to skip if value unchanged
  // an empty [] will only update on mount of component

  return (
    <div className={classes.root}>
      {_tq}
    </div>
  );
};


BookPackageTq.propTypes = {
  /** @ignore */
  classes: PropTypes.object,
  /** The Book ID to package. */
  bookId: PropTypes.string.isRequired,
   /** Comma list of chapters to package. Default is zero and returns all chapters of book*/
   chapter: PropTypes.string,
   /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(BookPackageTq);

