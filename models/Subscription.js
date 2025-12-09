const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const User = require('./User');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
        // mensal, trimestral, anual
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        // pending, active, expired, cancelled
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    paypal_order_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payer_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Relacionamento
User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Subscription;


