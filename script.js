let video = document.getElementById("camera");

let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let photoStrip =
    document.getElementById("photoStrip");

let downloadBtn =
    document.getElementById("downloadBtn");

let countdown =
    document.getElementById("countdown");

let filterSelect =
    document.getElementById("filter");

let photos = [];

let stream;


/* START CAMERA */

async function startCamera() {

    try {

        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });

        video.srcObject = stream;

    }

    catch (error) {

        alert(
            "Please allow camera permission! 📷💚"
        );

    }
}


/* TAKE 3 PHOTOS */

async function takePhotos() {

    if (!stream) {

        alert(
            "Start the camera first! 📷"
        );

        return;
    }

    photos = [];

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        await countdownTimer(3);

        capturePhoto();

        await wait(700);
    }

    createPhotoStrip();
}


/* COUNTDOWN */

function countdownTimer(seconds) {

    return new Promise(resolve => {

        let number = seconds;

        countdown.innerText = number;

        let timer =
            setInterval(() => {

                number--;

                if (number > 0) {

                    countdown.innerText =
                        number;

                } else {

                    clearInterval(timer);

                    countdown.innerText =
                        "📸";

                    setTimeout(() => {

                        countdown.innerText =
                            "";

                        resolve();

                    }, 500);
                }

            }, 1000);
    });
}


/* CAPTURE PHOTO */

function capturePhoto() {

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    ctx.filter =
        filterSelect.value;

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.filter = "none";

    photos.push(
        canvas.toDataURL("image/png")
    );
}


/* CREATE PHOTO STRIP */

function createPhotoStrip() {

    let width = 600;

    let photoHeight = 400;

    let stripHeight =
        (photoHeight * 3) + 180;

    let strip =
        document.createElement("canvas");

    strip.width = width;

    strip.height = stripHeight;

    let stripCtx =
        strip.getContext("2d");


    /* Background */

    stripCtx.fillStyle =
        "#fffdf7";

    stripCtx.fillRect(
        0,
        0,
        width,
        stripHeight
    );


    /* TITLE */

    stripCtx.fillStyle =
        "#6c9468";

    stripCtx.font =
        "bold 30px Arial";

    stripCtx.textAlign =
        "center";

    stripCtx.fillText(
        "🌿 MINTY MEMORIES 🌿",
        width / 2,
        45
    );


    /* PHOTOS */

    photos.forEach(
        (photo, index) => {

            let img =
                new Image();

            img.onload =
                function() {

                    let y =
                        70 +
                        (index * photoHeight);

                    stripCtx.drawImage(
                        img,
                        25,
                        y,
                        width - 50,
                        photoHeight - 10
                    );


                    /* PHOTO BORDER */

                    stripCtx.strokeStyle =
                        "#8eb68a";

                    stripCtx.lineWidth = 6;

                    stripCtx.strokeRect(
                        25,
                        y,
                        width - 50,
                        photoHeight - 10
                    );


                    /* FINISH */

                    if (
                        index ===
                        photos.length - 1
                    ) {

                        stripCtx.fillStyle =
                            "#6c9468";

                        stripCtx.font =
                            "20px Arial";

                        stripCtx.fillText(
                            "♡ memories made with love ♡",
                            width / 2,
                            stripHeight - 25
                        );


                        let finalImage =
                            strip.toDataURL(
                                "image/png"
                            );


                        photoStrip.src =
                            finalImage;

                        photoStrip.style.display =
                            "block";

                        downloadBtn.style.display =
                            "inline-block";
                    }

                };

            img.src = photo;
        }
    );
}


/* DOWNLOAD PHOTO */

function downloadPhoto() {

    let link =
        document.createElement("a");

    link.download =
        "minty-memories-photo-strip.png";

    link.href =
        photoStrip.src;

    link.click();
}


/* WAIT */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}

