const tiersToClient = (tiers) => {
    return tiers.map(tier => ({
        id: tier.id,
        name: tier.name
    }));
}

const validPartner = (partner) => {
    if(!partner.name || !partner.tier || !partner.description) {
        return false;
    }
    return true;
}


const partnerToClient = (partners) => {
    return partners.map(partner => ({
        id: partner.id,
        name: partner.name,
        logo: partner.logo,
        blur_image: partner.blur_image,
        tier: partner.tier,
        website: partner.website,
        description: partner.description
    }));
}

module.exports = { tiersToClient, validPartner, partnerToClient };
