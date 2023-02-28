const child = require('child_process').execFile;
const executableRoute = './CalculatorCuttingLength/Program.cs';

export default (req, res) => {
    if (req.method === 'GET') {
        require('child_process').exec('cd CalculatorCuttingLength && dotnet run', function (err, data) {

            if (err) {
                console.error(err);
                return;
            }

            res.status(200).json({
                response: data
            })
        });
    };
};