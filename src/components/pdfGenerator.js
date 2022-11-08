import { useRef } from 'react';
import jsPDF from 'jspdf';
import ReportTemplate from './ReportTemplate';

function App() {
	const reportTemplateRef = useRef(null);

	const handleGeneratePdf = () => {
		const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

	return (
		<div>
			<button className="button" onClick={handleGeneratePdf}>
				Generate PDF
			</button>
			<div ref={reportTemplateRef}>
				<div>
                    Hey there! 
                </div>
                <button>
                    PDF Saved...
                </button>
			</div>
		</div>
	);
}

export default App;