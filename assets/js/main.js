function ndsolve(f, x0, dt, tmax) {
    const n = f.size()[0]  // Number of variables
    const x = x0.clone()   // Current values of variables
    const dxdt = []        // Temporary variable to hold time-derivatives
    const result = []      // Contains entire solution

    const nsteps = math.divide(tmax, dt)   // Number of time steps
    for(let i=0; i<nsteps; i++) {
      // Compute derivatives
      for(let j=0; j<n; j++) {
        dxdt[j] = f.get([j]).apply(null, x.toArray())
      }
      // Euler method to compute next time step
      for(let j=0; j<n; j++) {
        x.set([j], math.add(x.get([j]), math.multiply(dxdt[j], dt)))
      }
      result.push(x.clone())
    }

    return math.matrix(result)
  }

  // Import the numerical ODE solver
  math.import({ndsolve:ndsolve})

  // Create a math.js context for our simulation. Everything else occurs in the context of the expression parser!

  const sim = math.parser()

  parser.set("beta", 1.478)
  parser.set("gamma", 0.333)
  parser.set("s0", 0.9999)
  parser.set("i0", 0.0001)
  parser.set("r0", 0.0)
  parser.set("dt = 1.0 d")                      // Simulation timestep
  parser.set("tfinal = 162 d")
  
  // Define the equations of SIR model. It is important to maintain the same argument order for each of these functions.
  sim.evaluate("dSdt(s, i, r, beta, gamma) = -beta * s * i")
  sim.evaluate("dIdt(s, i, r, beta, gamma) = beta * s * i - gamma * i")
  sim.evaluate("dRdt(s, i, r, beta, gamma) = gamma * i")
  

  // Again, remember to maintain the same variable order in the call to ndsolve.
  sim.evaluate("result = ndsolve([dSdt, dIdt, dRdt], [s0, i0, r0, phi0, gamma0], dt, tfinal)")

  // Extract the useful information from the results so it can be plotted
  /*
  window['chart'] = new Chart(document.getElementById('canvas1'), {
    type: 'line',
    data: {
      datasets: [{
        label: "Stage 1",
        data: data_stage1,
        fill: false,
        borderColor: "red",
        pointRadius: 0
      }, {
        label: "Interstage",
        data: data_interstage,
        fill: false,
        borderColor: "green",
        pointRadius: 0
      }, {
        label: "Stage 2",
        data: data_stage2,
        fill: false,
        borderColor: "orange",
        pointRadius: 0
      }, {
        label: "Unpowered",
        data: data_unpowered,
        fill: false,
        borderColor: "blue",
        pointRadius: 0
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    }

  })
  */