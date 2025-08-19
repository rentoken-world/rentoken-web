import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Welcome to{" "}
            <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent animate-pulse">
              RenToken
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Tokenize your rental property income. Invest in real estate revenue streams. 
            Bridge traditional real estate with{" "}
            <span className="text-secondary font-semibold">decentralized finance.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="sushi" size="xl" className="shadow-xl">
              🚀 Start Investing
            </Button>
            <Button variant="glass" size="xl" className="border-primary/30 hover:border-primary">
              🏠 List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How{" "}
            <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent">
              RenToken
            </span>{" "}
            Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="sushi" className="text-center p-8 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-sushi rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">For Property Owners</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tokenize your rental income, get immediate liquidity, and retain partial ownership in future revenue.
              </p>
            </Card>
            
            <Card variant="sushi" className="text-center p-8 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-sushi-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style={{animationDelay: '1s'}}>
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">For Investors</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Invest in stable rental income streams with transparent, blockchain-verified returns.
              </p>
            </Card>
            
            <Card variant="sushi" className="text-center p-8 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-sushi-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style={{animationDelay: '2s'}}>
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Blockchain Secured</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                All transactions are secured by smart contracts with full transparency and KYC compliance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="p-8 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold neon-text bg-gradient-sushi bg-clip-text text-transparent mb-2">
                  $2.5M+
                </div>
                <div className="text-muted-foreground">Total Value Locked</div>
              </div>
              <div>
                <div className="text-4xl font-bold neon-text bg-gradient-sushi-secondary bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-muted-foreground">Properties Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold neon-text bg-gradient-sushi-accent bg-clip-text text-transparent mb-2">
                  8.5%
                </div>
                <div className="text-muted-foreground">Average APY</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="p-12 border border-primary/30 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to{" "}
              <span className="neon-text bg-gradient-sushi bg-clip-text text-transparent">
                Get Started?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect your wallet and complete KYC verification to access the platform.
            </p>
            <Button variant="sushi" size="xl" className="shadow-2xl animate-pulse">
              🦄 Connect Wallet
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
