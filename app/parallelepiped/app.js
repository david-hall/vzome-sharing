const retryInterval = 3000
async function refresh() {
    const directions = new Map()
    document.querySelectorAll('axis-picker').forEach(picker => {
        const {orbit, axis, len, zomic} = picker
        const key = `${orbit} ${axis}`
        const value = {orbit, axis, len, zomic}
        directions.set(key, value)
    })
    const directionValues = Array.from(directions.values())
    const vZomeDirections = directionValues.map(value => `${value.orbit} ${value.axis}` ).join(' ')
    const zomicDirections = directionValues.map(value => `${value.orbit} ${value.zomic}`).join(' ')
    console.log(`vZome: ${vZomeDirections}\nzomic: ${zomicDirections}  // TODO: verify zomic directions`)
    document.getElementById("message").textContent = vZomeDirections

    // TODO: Use the core API to calculate the spreads for display
    const dims = directions.size
    let template = document.getElementById(`template-${dims}`).textContent

    const regex = /editNumber="(\d+)"/
    const match = template.match(regex)
    if (match && match.length > 1) {
        const oldEditNumber = match[1]
        // It's OK for the viewer if editNumber is larger than the total number of edits,
        // but I'll limit it in case the file is downloaded to desktop, which is a bit pickier.
        const newEditNumber = document.getElementById("editNumber").value
        if(+newEditNumber <= +oldEditNumber) { // use + prefix ensure numeric rather than alphabetic comparison
            // Adjust editNumber
            template = template.replace(`editNumber="${oldEditNumber}"`, `editNumber="${newEditNumber}"`)
        }
    }

    // Adjust template directions
    directionValues.forEach((value, i) => {
        const {orbit, axis, len, zomic} = value
        const oldDir = `dir="green" index="${i}" len="2 2"`
        const newDir = `dir="${orbit}" index="${axis}" len="${len}"`
        template = template.replace(oldDir, newDir)
        template = template.replace("<RunZomicScript>green -1", `<RunZomicScript>${orbit} ${zomic}`)
    })

    // Adjust camera
    // TODO: Replace these in the templates, not dynamically
    // unless they are different based on the chosen axes
    // const oldUp = `<UpDirection x="0.0" y="1.0" z="0.0"/>`
    // const oldLk = `<LookDirection x="0.0" y="0.0" z="-1.0"/>`
    // const newUp = `<UpDirection x="-0.40824830532073975" y="0.8164966106414795" z="-0.40824830532073975"/>`
    // const newLk = `<LookDirection x="-0.5773502588272095" y="-0.5773502588272095" z="-0.5773502588272095"/>`
    // template = template.replaceAll(oldLk, newLk).replaceAll(oldUp, newUp)

    // Trimming whitespace is not necessary for the viewer to render,
    // but if it's not trimmed, then a vZome file downloaded from the current version of the viewer
    // will fail to opened in desktop because that XML parser can't handle leading whitespace.
    // TODO: The viewer itself should trim anything rec'd by loadFromText()
    template = template.trim()

    const filename = `Parallelepiped-${directionValues.map(value => `${value.orbit}_${value.axis}`).join('-')}.vZome`
    // update the viewer
    const viewer = document.getElementById("viewer")
    // Older versions of the viewer didn't return a promise.
    // We use Promise.resolve rather than await
    // so we can be sure there is a .then() method
    // when using this code with older versions of the viewer.
    Promise.resolve(viewer.loadFromText(filename, template))
        .then(results => {
            if(results !== undefined) {
                console.log(results)
            }
            if(viewer.reactive == 'false') {
                viewer.update({camera:false})
            }
        })
        .catch(error => {
            console.error(error)
            alert(error)
            // TODO: Implement a retry that doesn't choke the viewer
            // console.log(`Retrying refresh() in ${retryInterval} mSec.`)
            // setTimeout(refresh, retryInterval)
        })
}

window.addEventListener("load", () => {
    const editNumber = document.getElementById('editNumber')
    document.getElementById('out-editNumber').value = editNumber.value
    const ticks = document.createElement('datalist')
    ticks.setAttribute("id", "ticks")
    for(let i=0; i <= editNumber.max; i++) {
        const opt = document.createElement("option")
        opt.setAttribute("value", i)
        // opt.setAttribute("label", i)
        ticks.appendChild(opt)
    }
    document.body.appendChild(ticks)

    editNumber.addEventListener("change", async event => {
        document.getElementById('out-editNumber').value = event.target.value
        refresh()
    })

    document.querySelectorAll('axis-picker').forEach(picker => {
        picker.addEventListener("change", async event => {
            refresh()
        })
    })

    // TODO: get rid of this HACK when we get real notification that the viewer is ready
    setTimeout(refresh, retryInterval)
})
