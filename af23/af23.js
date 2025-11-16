const snow = document.querySelectorAll("div")[0]
snow.style.rotate = '270deg'
af23 = Math.floor(Math.random() * 25)
if (af23 == 0) {
    af23 = Math.floor(Math.random() * 7)
    const location = ['https://www.youtube.com/watch?v=dQw4w9WgXcQ','crates.html','pixel_draw.html','gateway.html','rotary_moment.html','gravity.html','bsod.html'][af23]
    window.location.replace(location)
}
