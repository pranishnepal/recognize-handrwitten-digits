var model;

loadModel = async () => {
  const fileURL = "TFModelConverted/model.json";
  model = await tf.loadGraphModel(fileURL);
};

predictImageNumber = () => {
  let image = cv.imread(canvas);
  //Converting to B/W:
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  //Contrasting image:
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  /* Find Image Contour; code from Documentation */
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  /* subset of contours; code from documentation */
  let contoursSubset = contours.get(0);
  let rect = cv.boundingRect(contoursSubset);
  //Crop image
  image = image.roi(rect);

  /* ---SCALING IMAGE---- */

  let imgHeight = image.rows;
  let imgWidth = image.cols;

  if (imgHeight > imgWidth) {
    imgHeight = 20;
    const scalingFactor = image.rows / imgHeight;
    imgWidth = Math.round(imgWidth / scalingFactor);
  } else {
    imgWidth = 20;
    const scalingFactor = image.cols / imgWidth;
    imgHeight = Math.round(imgHeight / scalingFactor);
  }

  //Resizing image:
  let resizedImage = new cv.Size(imgWidth, imgHeight);
  cv.resize(image, image, resizedImage, 0, 0, cv.INTER_AREA);

  /* Adding padding to make the image 28px * 28 px */
  const leftPadding = Math.floor(4 + (20 - imgWidth) / 2);
  const rightPadding = Math.ceil(4 + (20 - imgWidth) / 2);
  const topPadding = Math.ceil(4 + (20 - imgHeight) / 2);
  const botPadding = Math.floor(4 + (20 - imgHeight) / 2);

  //padding with black boundary; code via documentation:
  const blackColor = new cv.Scalar(0, 0, 0, 0);
  cv.copyMakeBorder(
    image,
    image,
    topPadding,
    botPadding,
    leftPadding,
    rightPadding,
    cv.BORDER_CONSTANT,
    blackColor
  );

  /* Image centroid calculation: */
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  contoursSubset = contours.get(0);
  const momentsObj = cv.moments(contoursSubset, false);
  /* Formula for cx, cy is from documentation: */
  const cx = momentsObj.m10 / momentsObj.m00;
  const cy = momentsObj.m01 / momentsObj.m00;

  /* Image Shifting */
  //Shift factors:
  const xAxisShift = Math.round(image.cols / 2.0 - cx);
  const yAxisShift = Math.round(image.rows / 2.0 - cy);

  resizedImage = new cv.Size(image.cols, image.rows);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [
    1,
    0,
    xAxisShift,
    0,
    1,
    yAxisShift,
  ]);
  /* shifting */
  cv.warpAffine(
    image,
    image,
    M,
    resizedImage,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    blackColor
  );

  /* Divide image pixels so they are betwee 0-1, because our training data was in that form */
  let imgPixels = image.data;
  imgPixels = Float32Array.from(imgPixels);
  imgPixels = imgPixels.map((element) => {
    return element / 255.0;
  });

  /* Create a tensor, features */
  const X = tf.tensor([imgPixels]);

  /* ================Predicting Result ============== */
  const modelPrediction = model.predict(X);
  /* ---------------PRINT RESULT PRINTING HERE------------------- */
  //modelPrediction.print();

  /* Convert result to export: */
  const result = modelPrediction.dataSync()[0];

  /* Cleanup OpenCV */
  image.delete();
  contours.delete();
  contoursSubset.delete();
  hierarchy.delete();
  M.delete();
  /* Free up Tensor space */
  modelPrediction.dispose();
  X.dispose();

  return result;
};
