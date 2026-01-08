import React from 'react';

const HeroSection = ({ onRequestHelp }) => {
    return (
        <section style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '6rem 1rem 2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glow Effect */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(29, 53, 87, 0.5) 0%, rgba(15, 23, 42, 0) 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 1 }}>
                <span style={{
                    background: 'rgba(46, 196, 182, 0.1)',
                    color: 'var(--success-green)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    display: 'inline-block'
                }}>
                    ● Active Response System Online
                </span>

                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    marginBottom: '1.5rem',
                    lineHeight: 1.1,
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Every Second Counts.<br />
                    <span style={{ color: 'var(--primary-red)', WebkitTextFillColor: 'var(--primary-red)' }}>We Are Here.</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Instant coordination with nearby ambulances, hospitals, and emergency contacts.
                    One tap to save a life.
                </p>

                <button
                    onClick={onRequestHelp}
                    style={{
                        background: 'var(--primary-red)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '180px',
                        height: '180px',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 0 0 0 rgba(230, 57, 70, 0.7)',
                        animation: 'pulse-red 2s infinite',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Request<br />Immediate<br />Help
                </button>

                <style>{`
          @keyframes pulse-red {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 30px rgba(230, 57, 70, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
            }
          }
        `}</style>
            </div>
        </section>
    );
};

export default HeroSection;
