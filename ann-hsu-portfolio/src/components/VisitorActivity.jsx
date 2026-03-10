import ContributionGraph from './ContributionGraph';
import HiBox from './HiBox';
import './VisitorActivity.css';
import { useState, useCallback } from 'react';

export default function VisitorActivity() {
    const [hiRefreshKey, setHiRefreshKey] = useState(0);

    const handleHiSent = useCallback(() => {
        setHiRefreshKey((k) => k + 1);
    }, []);

    return (
        <section className="activity">
            <div className="activity__inner">
                <header className="activity__header">
                    <h2 className="activity__title">Visitor Hub</h2>
                    <p className="activity__subtitle">Say hi and leave a mark on the heatmap.</p>
                </header>

                <div className="activity__grid">
                    <div className="activity__graph-container">
                        <ContributionGraph refreshKey={hiRefreshKey} />
                    </div>
                    <div className="activity__input-container">
                        <HiBox onHiSent={handleHiSent} />
                    </div>
                </div>
            </div>
        </section>
    );
}
